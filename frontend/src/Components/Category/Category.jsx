import React from "react";
import "./Category.css";
import { Link } from "react-router-dom";
import { FiMonitor, FiWind, FiDroplet, FiScissors, FiZap } from "react-icons/fi";
import { PiBroom, PiHammerFill } from "react-icons/pi";

const Category = () => {
  const categories = [
    {
      to: "/women",
      label: "Women's Salon",
      image:
        "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1678864013225-bfc1de.jpeg",
      icon: <FiScissors />
    },
    {
      to: "/men",
      label: "Men's Salon",
      image:
        "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1750845033589-98cdfb.jpeg",
      icon: <FiScissors />
    },
    {
      to: "/ac",
      label: "AC & Appliance Repair",
      image:
        "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1751547558710-5ff49a.jpeg",
      icon: <FiWind />
    },
    {
      to: "/home-cleaning",
      label: "Cleaning",
      image:
        "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1699869110346-61ab83.jpeg",
      icon: <PiBroom />
    },
    {
      to: "/electrician",
      label: "Electrician",
      image:
        "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1678868062337-08bfc2.jpeg",
      icon: <FiZap />
    },
    {
      to: "/carpenter",
      label: "Carpenter",
      image:
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=200",
      icon: <PiHammerFill />
    },
    {
      to: "/plumber",
      label: "Plumber",
      image:
        "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1754919084321-eda462.jpeg",
      icon: <FiDroplet />
    },
    {
      to: "/pestcontrol",
      label: "Pest Control",
      image:
        "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1699869110346-61ab83.jpeg",
      icon: <FiMonitor />
    }
  ];

  return (
    <section className="category-section">
      <h3 className="category-title">What are you looking for?</h3>

      <div id="filters">
        {categories.map((category) => (
          <Link to={category.to} className="filter" key={category.label}>
            <div className="filter-image-wrap">
              <img src={category.image} alt={category.label} />
            </div>
            <div className="filter-icon">{category.icon}</div>
            <p>{category.label}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Category;
