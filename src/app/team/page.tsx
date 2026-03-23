import Image from "next/image";
import { getTeamMembers } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Our Team" };

function isValidUrl(url?: string) {
  return !!url && url.trim() !== "" && !url.startsWith("file://");
}

export default function TeamPage() {
  const team = getTeamMembers();

  return (
    <>
      <div className="page-header">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-3">Our Team</h1>
          <p className="text-white/75">Meet the passionate people behind Boys Who Cook.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {team.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">👥</div>
              <p>Add team members via the Admin panel.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {team.map((member) => (
                <div key={member.slug} className="text-center">
                  <div
                    className="relative mx-auto mb-5 w-36 h-36 rounded-full overflow-hidden shadow-md"
                    style={{ outline: "4px solid var(--color-primary-100)", outlineOffset: "2px" }}
                  >
                    {isValidUrl(member.photo) ? (
                      <Image src={member.photo!} alt={member.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl text-white font-bold" style={{ background: "var(--color-primary-700)" }}>
                        {member.title.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-base" style={{ color: "var(--color-primary-700)" }}>{member.title}</h3>
                  <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-3">{member.role}</p>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">{member.bio}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section-alt text-center">
        <div className="container max-w-xl">
          <h2 className="font-serif text-2xl font-semibold mb-4" style={{ color: "var(--color-primary-700)" }}>Want to Volunteer?</h2>
          <p className="text-gray-500 mb-7">We&apos;re always looking for passionate people to help mentor our participants and support our mission.</p>
          <a href="/contact" className="btn-primary">Get Involved</a>
        </div>
      </section>
    </>
  );
}
