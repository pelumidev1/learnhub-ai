import { Reveal } from "./reveal";

/**
 * "From the masterclass": messages people sent in the free masterclass's
 * WhatsApp group, from screenshots Pelumi supplied. Bolu, Sandra and Ola each
 * agreed to be quoted, first name only (Pelumi confirmed, 2026-10-02).
 *
 * Quoted word for word, emoji included, with the time each was sent. Edited
 * would make them testimonials we wrote. Names are first name or handle only,
 * and the role is from each person's own introduction in the group; no
 * surnames, photos or numbers. Messages that thank Pelumi by name are left
 * out: the product speaks as Learnhub (CLAUDE.md, Tone).
 *
 * Only add a quote that exists, and only with that person's OK.
 */
const QUOTES = [
  {
    text: "First Class and I was able to learn quite some important things/hidden secrets which have been right in front of me the whole time",
    name: "Bolu",
    role: "Digital sales",
    time: "15:05",
  },
  {
    text: "Thank you so much for the class. That was insightful ❤️ Looking forward to tomorrow’s session",
    name: "Sandra",
    role: "Realtor and CRM manager",
    time: "15:03",
  },
  {
    text: "Thank you for taking the time to explain and break it down 🤝✅",
    name: "Ola",
    role: "Masterclass attendee",
    time: "15:22",
  },
];

export function MasterclassQuotes() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-[1180px] px-5">
        <Reveal>
          <h2 className="text-center font-serif text-[2.75rem] leading-[1.05] tracking-[-0.01em] text-ink sm:text-[4rem]">
            From the masterclass
          </h2>
        </Reveal>

        <ul className="mt-12 grid gap-4 sm:mt-16 md:grid-cols-3">
          {QUOTES.map((q, i) => (
            <Reveal key={q.name} as="li" delay={i * 90} className="flex flex-col">
              {/* A chat bubble: the tail corner and the timestamp say where
                  these came from before the caption does. */}
              <figure className="flex flex-1 flex-col">
                <blockquote className="relative flex-1 rounded-[20px] rounded-bl-md border border-silver bg-paper px-6 pb-9 pt-6">
                  <p className="font-serif text-[1.45rem] leading-[1.3] text-ink">{q.text}</p>
                  <span className="absolute bottom-3 right-4 font-mono text-[11px] text-muted-2">{q.time}</span>
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-3 pl-1">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-blue text-sm font-semibold text-white" aria-hidden>
                    {q.name[0]}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">{q.name}</span>
                    <span className="block text-[13px] text-muted">{q.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
        <p className="mt-8 text-center text-[13px] text-muted">Sent in the free masterclass&apos;s WhatsApp group.</p>
      </div>
    </section>
  );
}
