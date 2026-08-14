const clients = [
  { name: 'রাফি আহমেদ', note: 'Netflix setup hoye geche 10 min e' },
  { name: 'সুমাইয়া খান', note: 'Canva Pro niye design life easy' },
  { name: 'তানভীর হাসান', note: 'VPN plan smooth, support fast' },
  { name: 'নুসরাত জাহান', note: 'ChatGPT Plus delivery super quick' },
  { name: 'আরিফুল ইসলাম', note: 'Hoichoi and Chorki duita-i verified' },
  { name: 'মেহজাবিন রহমান', note: 'Office 365 activation tension-free' },
]

export default function ClientBanner() {
  return (
    <section className="client-banner" aria-label="Satisfied clients">
      <div className="client-banner-heading">
        <span>Happy Clients</span>
        <h2>Deshi names, premium smiles.</h2>
      </div>
      <div className="client-marquee">
        {[...clients, ...clients].map((client, index) => (
          <article className="client-pill" key={`${client.name}-${index}`}>
            <span>{client.name}</span>
            <p>{client.note}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
