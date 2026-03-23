import Image from "next/image";
import Link from "next/link";
import { getUpcomingEvents, getPastEvents } from "@/lib/content";
import { marked } from "marked";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Events" };

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function EventsPage() {
  const upcoming = getUpcomingEvents();
  const past = getPastEvents();

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">Events</h1>
          <p className="text-white/85 text-lg">
            Join us for cooking classes, community cookouts, and more. All events are free and open to the community.
          </p>
        </div>
      </div>

      {/* Upcoming Events */}
      <section className="section">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-gray-900 mb-8 flex items-center gap-3">
            <span className="text-primary-600">📅</span> Upcoming Events
          </h2>

          {upcoming.length === 0 ? (
            <div className="text-center py-12 bg-orange-50 rounded-2xl">
              <div className="text-5xl mb-3">📅</div>
              <p className="text-gray-500 text-lg">No upcoming events right now.</p>
              <p className="text-gray-400 mt-1">Check back soon — we add new events regularly!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {upcoming.map((event) => {
                const bodyHtml = marked.parse(event.body || "");
                return (
                  <div key={event.slug} className="card overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      {/* Date block */}
                      <div className="bg-primary-600 text-white p-6 flex flex-col items-center justify-center min-w-[120px] md:min-w-[140px]">
                        <div className="text-3xl font-bold font-heading">
                          {new Date(event.date).getDate()}
                        </div>
                        <div className="text-primary-100 text-sm font-medium uppercase">
                          {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                        </div>
                        <div className="text-primary-200 text-sm">
                          {new Date(event.date).getFullYear()}
                        </div>
                      </div>

                      {/* Event image if available */}
                      {event.image && (
                        <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0">
                          <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-6 flex-1">
                        <h3 className="text-xl font-bold font-heading text-gray-900 mb-2">
                          {event.title}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1.5">
                            🕐 {formatTime(event.date)}
                            {event.end_date && ` – ${formatTime(event.end_date)}`}
                          </span>
                          <span className="flex items-center gap-1.5">
                            📍 {event.location}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{event.excerpt}</p>
                        {event.registration_link && (
                          <a
                            href={event.registration_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary text-sm py-2"
                          >
                            Register Now
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Past Events */}
      {past.length > 0 && (
        <section className="section-alt">
          <div className="container">
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-gray-900 mb-8 flex items-center gap-3">
              <span className="text-gray-400">🗓️</span> Past Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {past.map((event) => (
                <div key={event.slug} className="card opacity-80 hover:opacity-100 transition-opacity">
                  {event.image && (
                    <div className="relative h-40">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover grayscale"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="text-xs text-gray-400 mb-2 font-medium">
                      {formatDate(event.date)}
                    </div>
                    <h3 className="font-bold font-heading text-gray-800 mb-1">{event.title}</h3>
                    <p className="text-sm text-gray-500">{event.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stay Updated CTA */}
      <section className="bg-primary-600 text-white py-14 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold font-heading mb-3">
            Never Miss an Event
          </h2>
          <p className="text-white/85 mb-6">
            Follow us on social media or contact us to be added to our mailing list.
          </p>
          <Link href="/contact" className="btn-secondary">
            Stay Connected
          </Link>
        </div>
      </section>
    </>
  );
}
