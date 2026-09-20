import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ProblemExplorer } from './components/ProblemExplorer';
import { ArchitecturePipeline } from './components/ArchitecturePipeline';
import { NormalizationStudio } from './components/NormalizationStudio';
import { SemanticClustering } from './components/SemanticClustering';
import { BenchmarkMetrics } from './components/BenchmarkMetrics';
import { TechStackRoadmap } from './components/TechStackRoadmap';
import { Footer } from './components/Footer';
import { VideoWalkthrough } from './components/VideoWalkthrough';

export default function App() {
  const [isVideoTourOpen, setIsVideoTourOpen] = useState<boolean>(false);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartTour = () => {
    setIsVideoTourOpen(true);
    scrollToSection('hero');
  };

  return (
    <div className="min-h-screen bg-[#080b11] text-[#e2e8f0] flex flex-col font-sans selection:bg-orange-500/30 selection:text-orange-200">
      {/* Top sticky navigation bar */}
      <Header 
        onScrollToSection={scrollToSection} 
        onOpenVideoTour={handleStartTour}
        isVideoTourActive={isVideoTourOpen}
      />

      {/* Main content body */}
      <main className="flex-1">
        {/* Slide 1: Hero and Live Transformation Terminal */}
        <HeroSection
          onExploreStudio={() => scrollToSection('studio')}
          onExploreProblem={() => scrollToSection('problem')}
          onOpenVideoTour={handleStartTour}
        />

        {/* Slide 2 & 3: Fragmented Languages and Semantic Ambiguity Failure Modes */}
        <ProblemExplorer />

        {/* Slide 6 & 7: Trapping Stochastic Outputs within Deterministic Borders */}
        <ArchitecturePipeline />

        {/* Slide 10 & 4 & 5: Real-Time Interactive Normalization Studio */}
        <NormalizationStudio />

        {/* Slide 8: Semantic Clustering Radar */}
        <SemanticClustering />

        {/* Slide 9: 100-Tool Benchmark Metrics and Data Browser */}
        <BenchmarkMetrics />

        {/* Slide 11 & 12: Tech Stack Matrix and Universal Registry Roadmap */}
        <TechStackRoadmap />
      </main>

      {/* Footer */}
      <Footer onScrollToSection={scrollToSection} />

      {/* Interactive Video Tour Controller & Narration HUD */}
      <VideoWalkthrough
        isOpen={isVideoTourOpen}
        onClose={() => setIsVideoTourOpen(false)}
        onScrollToSection={scrollToSection}
      />
    </div>
  );
}
