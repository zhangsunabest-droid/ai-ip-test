function CyberAgentsLayer() {
  const stars = [
    { id: "s1", left: "9%", top: "14%", size: 3.8, delay: "0s" },
    { id: "s2", left: "18%", top: "27%", size: 3.1, delay: "-0.6s" },
    { id: "s3", left: "27%", top: "11%", size: 3.4, delay: "-1.2s" },
    { id: "s4", left: "41%", top: "24%", size: 4.2, delay: "-0.2s" },
    { id: "s5", left: "56%", top: "13%", size: 3, delay: "-1.7s" },
    { id: "s6", left: "73%", top: "21%", size: 3.6, delay: "-0.9s" },
    { id: "s7", left: "84%", top: "12%", size: 4.4, delay: "-1.5s" },
    { id: "s8", left: "91%", top: "26%", size: 2.8, delay: "-0.3s" },
    { id: "s9", left: "14%", top: "62%", size: 3.9, delay: "-1.1s" },
    { id: "s10", left: "34%", top: "71%", size: 3.2, delay: "-0.4s" },
    { id: "s11", left: "52%", top: "64%", size: 4.2, delay: "-1.9s" },
    { id: "s12", left: "68%", top: "73%", size: 3.3, delay: "-0.8s" },
    { id: "s13", left: "82%", top: "67%", size: 3.0, delay: "-1.3s" },
    { id: "s14", left: "93%", top: "58%", size: 3.7, delay: "-0.1s" },
  ]
  const meteors = [
    { id: "m1", left: "8%", top: "8%", delay: "-0.9s", duration: "3.2s" },
    { id: "m2", left: "22%", top: "14%", delay: "-2.1s", duration: "3.5s" },
    { id: "m3", left: "38%", top: "10%", delay: "-1.4s", duration: "3.1s" },
    { id: "m4", left: "55%", top: "16%", delay: "-2.8s", duration: "3.4s" },
    { id: "m5", left: "71%", top: "11%", delay: "-1.9s", duration: "3.0s" },
    { id: "m6", left: "84%", top: "19%", delay: "-2.5s", duration: "3.3s" },
    { id: "m7", left: "16%", top: "22%", delay: "-0.6s", duration: "3.6s" },
    { id: "m8", left: "64%", top: "6%", delay: "-1.2s", duration: "3.2s" },
  ]

  return (
    <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden" aria-hidden>
      <div className="cyber-scanlines absolute inset-0 opacity-[0.08]" />
      <div className="aurora-night-sky absolute inset-0" />
      <div className="aurora-clouds absolute inset-0" />
      <div className="aurora-sheet aurora-sheet-a absolute inset-0" />
      <div className="aurora-sheet aurora-sheet-b absolute inset-0" />
      <div className="aurora-sheet aurora-sheet-c absolute inset-0" />
      <div className="aurora-mountain aurora-mountain-a absolute inset-x-0 bottom-[34%] h-[16%]" />
      <div className="aurora-mountain aurora-mountain-b absolute inset-x-0 bottom-[30%] h-[14%]" />
      <div className="aurora-lake absolute inset-x-0 bottom-0 h-[34%]" />
      <div className="aurora-reflection absolute inset-x-0 bottom-[12%] h-[18%]" />
      <div className="aurora-haze absolute inset-0" />
      <div className="aurora-film-grain absolute inset-0" />
      {stars.map((star) => (
        <i
          key={star.id}
          className="aurora-star absolute rounded-full"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: star.delay,
          }}
        />
      ))}
    </div>
  )
}

export default CyberAgentsLayer
