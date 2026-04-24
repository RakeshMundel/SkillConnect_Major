import React, { useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Profile from "../Components/Profile/Profile";
import { Context } from "../Context/Context";

const includesText = (value, text) =>
  String(value || "").toLowerCase().includes(text.toLowerCase());

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const { all_profile } = useContext(Context);
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const query = params.get("query") || "";
  const locationFilter = params.get("location") || "";

  useEffect(() => {
    if (!query && !locationFilter) {
      setResults([]);
      return;
    }

    const searchParams = new URLSearchParams();
    if (query) searchParams.set("query", query);
    if (locationFilter) searchParams.set("location", locationFilter);

    fetch(`http://localhost:4000/search?${searchParams.toString()}`)
      .then((res) => res.json())
      .then((data) => setResults(Array.isArray(data) ? data : []))
      .catch(() => setResults([]));
  }, [query, locationFilter]);

  const localResults = useMemo(() => {
    return all_profile.filter((profile) => {
      const matchesQuery = !query || [
        profile.name,
        profile.category,
        profile.skills,
        profile.description,
        profile.location
      ].some((value) => includesText(value, query));

      const matchesLocation =
        !locationFilter || includesText(profile.location, locationFilter);

      return matchesQuery && matchesLocation;
    });
  }, [all_profile, query, locationFilter]);

  const mergedResults = useMemo(() => {
    const byId = new Map();

    [...results, ...localResults].forEach((profile) => {
      const key = profile.id || profile._id;
      if (!key) return;
      byId.set(key, profile);
    });

    return [...byId.values()];
  }, [results, localResults]);

  const headingText = [query, locationFilter].filter(Boolean).join(" in ");

  return (
    <div style={{ padding: "40px" }}>
      <h2>
        Search Results for: <span style={{ color: "#0aa" }}>{headingText || "all profiles"}</span>
      </h2>

      {mergedResults.length === 0 ? (
        <p>No professionals found.</p>
      ) : (
        <div className="prof-profile">
          {mergedResults.map((profile) => (
            <Profile
              key={profile.id || profile._id}
              id={profile.id}
              name={profile.name}
              image={profile.image}
              rating={profile.rating}
              location={profile.location}
              phone={profile.phone}
              owner={profile.owner}
              experience={profile.experience}
              certificate={profile.certificate}
              skills={profile.skills}
              category={profile.category}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
