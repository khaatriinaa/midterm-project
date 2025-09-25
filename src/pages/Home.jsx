import { useState, useEffect, useRef } from "react";
import spacesData from "../data/spaces.json";
import SpaceCard from "../components/SpaceCard";

export default function Home() {
  const [spaces, setSpaces] = useState([]);
  const [query, setQuery] = useState("");
  const spacesRef = useRef(null);

  useEffect(() => {
    setSpaces(spacesData);
  }, []);

  const filtered = spaces.filter(
    (space) =>
      space.name.toLowerCase().includes(query.toLowerCase()) ||
      space.location.toLowerCase().includes(query.toLowerCase())
  );

  const handleDiscoverClick = () => {
    spacesRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
  };

  return (
    <div>
      {/* Full Screen Hero */}
      <section className="hero-section">
        <div className="hero-text">
          <h1>
            Find Your <span className="highlight">Perfect Study Space</span>
          </h1>
          <p>
            Search, discover, and book study rooms in just a few clicks. 
            Save time and focus on what matters most—your studies.
          </p>
          <button className="discover-btn" onClick={handleDiscoverClick}>
            Discover Study Spaces
          </button>
        </div>
        <div className="hero-image">
          <img src="/studynook.png" alt="Study Space" />
        </div>
      </section>

      {/* Spaces Section */}
      <section ref={spacesRef} className="spaces-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search study spaces..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="space-list">
          {filtered.map((space) => (
            <SpaceCard key={space.id} space={space} />
          ))}
        </div>
      </section>
    </div>
  );
}
