import React from 'react'

const About = () => {
  return (
    <>
      <section className="max-w-4xl mx-auto px-6 py-16">
    <h2 className="text-4xl font-bold text-center mb-4">👋 Meet The Dev</h2>
    <p className="text-center text-lg text-gray-300 mb-12">
      Code-slinging creative. I build, break, and build again — but better.
    </p>

    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-16">
      <div className="bg-gray-800 p-4 rounded-lg text-center">
        <p className="text-2xl font-bold">12+</p>
        <p className="text-sm text-gray-400">Projects Shipped</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg text-center">
        <p className="text-2xl font-bold">3+ yrs</p>
        <p className="text-sm text-gray-400">Experience</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg text-center">
        <p className="text-2xl font-bold">Full-Stack</p>
        <p className="text-sm text-gray-400">React / Node / Mongo</p>
      </div>
    </div>


    <div className="mb-16">
      <h3 className="text-2xl font-semibold mb-4">😜 Fun Facts</h3>
      <ul className="list-disc pl-5 text-gray-300 space-y-2">
        <li>Fuelled by mango juice & late-night bugs</li>
        <li>Lo-fi beats while coding = ✨flow mode✨</li>
        <li>Debugs better after a snack break</li>
      </ul>
    </div>

    <div className="mb-16">
      <h3 className="text-2xl font-semibold mb-4">🛣️ My Dev Journey</h3>
      <div className="space-y-4 border-l-2 border-pink-500 pl-4">
        <div><span className="font-bold">2019:</span> First HTML/CSS site → 💥</div>
        <div><span className="font-bold">2020:</span> JavaScript clicked. Chaos followed.</div>
        <div><span className="font-bold">2021:</span> Full-stack builds, Git mastery</div>
        <div><span className="font-bold">2022–Now:</span> Freelancing & API wizardry</div>
      </div>
    </div>

    <blockquote className="text-center italic text-pink-400 text-xl">
      "Build fast. Break smart. Ship weird stuff."
    </blockquote>

  </section>
    </>
  )
}

export default About
