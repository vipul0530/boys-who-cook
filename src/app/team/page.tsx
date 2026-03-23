import Image from "next/image";
import { getTeamMembers } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Our Team" };

export default function TeamPage() {
  const team = getTeamMembers();

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">Our Team</h1>
          <p className="text-white/85 text-lg">
            Meet the passionate people behind Boys Who Cook.
          </p>
        </div>
      </div>

      {/* Team Grid */}
      <section className="section">
        <div className="container">
          {team.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-6xl mb-4">👥</div>
              <p className="text-lg">Add team members via the Admin panel.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {team.map((member) => (
                <div
                  key={member.slug}
                  className="text-center group"
                >
                  {/* Photo */}
                  <div className="relative mx-auto mb-5 w-36 h-36 rounded-full overflow-hidden shadow-lg ring-4 ring-primary-100 group-hover:ring-primary-300 transition-all duration-300">
                    {member.photo ? (
                      <Image
                        src={member.photo}
                        alt={member.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center">
                        <span className="text-5xl text-white">
                          {member.title.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  <h3 className="font-bold font-heading text-lg text-gray-900">
                    {member.title}
                  </h3>
                  <p className="text-primary-600 text-sm font-semibold mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Join Team CTA */}
      <section className="section-alt text-center">
        <div className="container max-w-2xl">
          <div className="text-5xl mb-4">🙋</div>
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-gray-900 mb-4">
            Want to Volunteer?
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            We&apos;re always looking for passionate volunteers to help run our programs, mentor our participants, and support our mission.
          </p>
          <a
            href="/contact"
            className="btn-primary"
          >
            Get Involved
          </a>
        </div>
      </section>
    </>
  );
}
