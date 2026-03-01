import type { CVData } from "@/types";
import { PdfSafeWrapper } from "@/components/cv/PdfSafeWrapper";
import {
  Mail,
  Phone,
  MapPin,
  User,
  Briefcase,
  GraduationCap,
  Users,
  Lightbulb,
  Globe,
  Heart
} from "lucide-react";

interface CVTemplateProps {
  data: CVData;
}

export default function CVTemplate({ data }: CVTemplateProps) {
  const primaryColor = "#00a99d"; // Vert Teal exact de la photo

  return (
    <PdfSafeWrapper>
      <div className="w-full min-h-[1123px] bg-white text-gray-800 font-sans flex shadow-2xl overflow-hidden border-[12px]" style={{ borderColor: primaryColor }}>

        {/* COLONNE GAUCHE (SIDEBAR) */}
        <aside className="w-[38%] bg-[#f0f7f7] p-8 flex flex-col border-r border-gray-200">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-800 tracking-tighter leading-none mb-2">{data.fullName}</h1>
            <p className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: primaryColor }}>{data.title}</p>
          </div>

          <div className="mb-10 flex justify-center">
            <div className="w-44 h-44 rounded-full border-[6px] border-white shadow-xl overflow-hidden bg-gray-200">
              {data.profileImage ? (
                <img src={data.profileImage} className="w-full h-full object-cover" alt="Profile" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">Photo</div>
              )}
            </div>
          </div>

          <div className="space-y-10 text-black">
            <section>
              <SidebarHeading icon={<Phone size={16} />} title="CONTACT ME" color={primaryColor} />
              <div className="space-y-3 text-[11px] font-medium text-slate-600">
                <div className="flex items-center gap-3"><Phone size={14} className="text-slate-400" /><span>{data.contact.phone}</span></div>
                <div className="flex items-center gap-3"><Mail size={14} className="text-slate-400" /><span>{data.contact.email}</span></div>
                <div className="flex items-center gap-3"><MapPin size={14} className="text-slate-400" /><span>{data.contact.address}</span></div>
              </div>
            </section>

            {data.education && data.education.length > 0 && (
              <section>
                <SidebarHeading icon={<GraduationCap size={16} />} title="EDUCATION" color={primaryColor} />
                <div className="space-y-6">
                  {data.education.map((edu, i) => (
                    <div key={i} className="space-y-1">
                      <h4 className="text-[11px] font-black uppercase text-slate-800">{edu.degree}</h4>
                      <p className="text-[10px] text-slate-500 font-bold italic">{edu.school}</p>
                      <p className="text-[9px] font-black text-slate-400 tracking-widest uppercase">{edu.startDate} - {edu.endDate}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.references && data.references.length > 0 && (
              <section>
                <SidebarHeading icon={<Users size={16} />} title="REFERENCES" color={primaryColor} />
                <div className="space-y-6">
                  {data.references.map((ref, i) => (
                    <div key={i} className="space-y-1">
                      <h4 className="text-[11px] font-black uppercase text-slate-800">{ref.name}</h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed whitespace-pre-line">{ref.contact}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </aside>

        {/* COLONNE DROITE */}
        <main className="w-[62%] p-10 flex flex-col bg-white">
          <div className="space-y-12">
            <section>
              <MainHeading icon={<User size={16} />} title="ABOUT ME" color={primaryColor} />
              <p className="text-[11px] leading-relaxed text-slate-500 font-medium text-black">{data.about}</p>
            </section>

            <section>
              <MainHeading icon={<Briefcase size={16} />} title="JOB EXPERIENCE" color={primaryColor} />
              <div className="space-y-8">
                {data.experiences.map((exp, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-baseline text-black">
                      <h4 className="font-black text-slate-800 text-[11px] uppercase tracking-tight">{exp.role}</h4>
                      <span className="text-[10px] font-black text-slate-400 tracking-tighter italic">{exp.startDate} - {exp.endDate || "Present"}</span>
                    </div>
                    <div className="text-[10px] font-bold italic" style={{ color: primaryColor }}>{exp.company}</div>
                    <p className="text-[10px] leading-relaxed text-slate-400 whitespace-pre-line">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {data.skills && data.skills.length > 0 && (
              <section>
                <MainHeading icon={<Lightbulb size={16} />} title="SKILLS" color={primaryColor} />
                <div className="grid grid-cols-2 gap-x-10 gap-y-4">
                  {data.skills.map((s, i) => (
                    <div key={i} className="space-y-1.5 text-black">
                      <div className="flex justify-between text-[10px] font-bold text-slate-700"><span>{s.name}</span></div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${s.level}%`, backgroundColor: primaryColor }} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="grid grid-cols-2 gap-10">
              {data.languages && data.languages.length > 0 && (
                <section>
                  <MainHeading icon={<Globe size={16} />} title="LANGUAGE" color={primaryColor} />
                  <div className="grid grid-cols-1 gap-2 text-black">
                    {data.languages.filter(l => l.trim()).map((l, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{l}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {data.hobbies && data.hobbies.length > 0 && (
                <section>
                  <MainHeading icon={<Heart size={16} />} title="HOBBIES" color={primaryColor} />
                  <div className="grid grid-cols-1 gap-2 text-black">
                    {data.hobbies.filter(h => h.trim()).map((h, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{h}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </main>
      </div>
    </PdfSafeWrapper>
  );
}

function SidebarHeading({ icon, title, color }: { icon: React.ReactNode, title: string, color: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: color }}>{icon}</div>
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800">{title}</h3>
    </div>
  );
}

function MainHeading({ icon, title, color }: { icon: React.ReactNode, title: string, color: string }) {
  return (
    <div className="flex items-center gap-3 mb-6 pb-2 border-b-2 border-slate-100">
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: color }}>{icon}</div>
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800">{title}</h3>
    </div>
  );
}
