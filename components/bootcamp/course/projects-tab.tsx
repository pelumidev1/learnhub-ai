import type { GalleryProject, MyProject } from "@/lib/bootcamp/gallery";
import { Icons } from "@/components/ui/icons";
import { ShareToggle } from "./share-toggle";

/**
 * The Projects tab: your own projects with their review status, then the
 * cohort gallery of approved projects their owners chose to share.
 *
 * `gallery` is null until the gallery migration has been applied; the tab
 * then shows your own projects only, without the share switches, rather than
 * offering a switch that cannot save.
 */
const STATUS: Record<MyProject["status"], { label: string; tone: string }> = {
  submitted: { label: "In review", tone: "bg-paper-2 text-blue" },
  approved: { label: "Approved", tone: "bg-blue text-white" },
  changes_requested: { label: "Changes requested", tone: "bg-silver text-ink" },
};

const weekLabel = (p: { week: number | null; kind: string }) =>
  p.kind === "final" ? "Final project" : p.week ? `Week ${p.week}` : "Project";

export function ProjectsTab({
  mine,
  gallery,
  member,
}: {
  mine: MyProject[];
  gallery: GalleryProject[] | null;
  member: boolean;
}) {
  return (
    <div className="space-y-12">
      <section>
        <h2 className="font-serif text-[1.9rem] leading-tight text-ink sm:text-[2.25rem]">Your projects</h2>
        {mine.length === 0 ? (
          <p className="mt-3 text-[15px] text-muted">
            {member
              ? "Your weekly projects appear here once you hand them in."
              : "Your projects appear here once you're enrolled and hand one in."}
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {mine.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center gap-4 rounded-[16px] border border-silver bg-white px-5 py-4">
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted-2">{weekLabel(p)}</p>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block break-words font-semibold text-ink hover:text-blue sm:truncate"
                  >
                    {p.title}
                  </a>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS[p.status].tone}`}>
                  {STATUS[p.status].label}
                </span>
                {gallery !== null && p.status === "approved" && (
                  <ShareToggle submissionId={p.id} initial={p.shared} />
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {member && (
        <section>
          <h2 className="font-serif text-[1.9rem] leading-tight text-ink sm:text-[2.25rem]">Cohort gallery</h2>
          <p className="mt-2 text-[15px] text-muted">
            Approved projects your classmates chose to share. Yours stay private until you switch
            them on.
          </p>
          {!gallery || gallery.length === 0 ? (
            <div className="mt-5 rounded-[20px] border border-dashed border-silver-2 bg-paper px-6 py-12 text-center">
              <p className="font-semibold text-ink">No shared projects yet</p>
              <p className="mt-1 text-sm text-muted">They appear here as projects are approved and shared.</p>
            </div>
          ) : (
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((p) => (
                <li key={p.id}>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col rounded-[20px] border border-silver bg-white p-5 transition duration-200 ease-out hover:-translate-y-0.5 hover:border-blue/40 hover:shadow-[0_1px_2px_rgba(11,15,26,.06),0_16px_40px_-16px_rgba(11,15,26,.22)]"
                  >
                    <p className="font-mono text-xs uppercase tracking-[0.12em] text-blue">{weekLabel(p)}</p>
                    <p className="mt-2 flex-1 font-semibold text-ink group-hover:text-blue">{p.title}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-muted">
                        <span className="grid h-7 w-7 place-items-center rounded-full bg-blue text-xs font-semibold text-white">
                          {p.firstName[0]}
                        </span>
                        {p.firstName}
                      </span>
                      <Icons.external className="h-4 w-4 text-muted-2" />
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
