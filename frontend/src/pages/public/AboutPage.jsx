import { Award } from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'
import { FadeUp, FadeStagger, FadeItem, SlideIn } from '@/components/atoms/FadeUp'

const techSections = [
  {
    title: 'AI Model',
    items: ['Universal Sentence Encoder (base model)', 'Transfer learning', 'Neural network classification head', 'Intent classification'],
  },
  {
    title: 'Knowledge Base',
    items: ['MOTHER Dataset', 'WHO ANC Guidelines', 'FMOH Nigeria Protocols', 'Expert-curated content'],
  },
  {
    title: 'Frontend',
    items: ['React + Vite', 'TailwindCSS', 'Zustand state management', 'Mobile-first design'],
  },
  {
    title: 'Backend',
    items: ['Python Flask', 'RESTful API', 'JWT authentication', 'Secure data handling'],
  },
]

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">

      {/* Header */}
      <FadeUp className="text-center mb-14">
        <Badge variant="rose" size="lg" className="mb-4">Final Year Project</Badge>
        <h1 className="font-display font-extrabold text-4xl md:text-5xl text-text-primary mb-5">
          About MamaGuide
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
          MamaGuide is a deep learning-based chatbot designed to enhance maternal health
          education in Nigeria, developed as a Final Year Project.
        </p>
      </FadeUp>

      {/* Problem / Solution */}
      <div className="grid md:grid-cols-2 gap-8 mb-14">
        <SlideIn from="left">
          <h2 className="font-display font-bold text-2xl text-text-primary mb-4">The Problem</h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            Nigeria has one of the highest maternal mortality rates in the world, with approximately
            512 deaths per 100,000 live births. Many of these deaths are preventable with access to
            proper health information.
          </p>
          <p className="text-text-secondary leading-relaxed">
            Limited access to healthcare providers, language barriers, and low health literacy leave
            many pregnant women without critical knowledge they need to stay safe.
          </p>
        </SlideIn>

        <SlideIn from="right" delay={0.1}>
          <h2 className="font-display font-bold text-2xl text-text-primary mb-4">Our Solution</h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            MamaGuide uses transfer learning: Google's Universal Sentence Encoder (a pretrained
            base model) converts each question into a semantic embedding, and a custom-trained
            neural network classifies it into a maternal health intent to answer in natural
            language.
          </p>
          <p className="text-text-secondary leading-relaxed">
            The knowledge base is drawn from the MOTHER dataset, WHO ANC guidelines, and Federal
            Ministry of Health Nigeria protocols.
          </p>
        </SlideIn>
      </div>

      {/* Tech stack */}
      <FadeUp className="bg-white rounded-3xl border border-border p-8 mb-10">
        <h2 className="font-display font-bold text-xl text-text-primary mb-5">
          Technical Architecture
        </h2>
        <FadeStagger className="grid sm:grid-cols-2 gap-5" stagger={0.07}>
          {techSections.map(section => (
            <FadeItem key={section.title}>
              <div>
                <h3 className="font-semibold text-sm text-text-primary mb-2.5">{section.title}</h3>
                <ul className="space-y-1.5">
                  {section.items.map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-text-secondary">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeItem>
          ))}
        </FadeStagger>
      </FadeUp>

      {/* Evaluation */}
      <FadeUp>
        <div className="text-center bg-rose-50 rounded-3xl border border-rose-200 p-8">
          <Award className="w-10 h-10 text-rose-600 mx-auto mb-3" aria-hidden />
          <h2 className="font-display font-bold text-xl text-text-primary mb-2">
            System Evaluation
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed max-w-lg mx-auto">
            MamaGuide is evaluated using the System Usability Scale (SUS), a validated 10-item
            questionnaire for measuring system usability. Participants are invited to complete the
            evaluation after using the system.
          </p>
        </div>
      </FadeUp>

    </div>
  )
}
