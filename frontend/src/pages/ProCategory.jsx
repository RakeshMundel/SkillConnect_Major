import React, { useContext } from 'react';

import './ProCategory.css';
import dropdown_icon from '../Components/Assets/dropdown_icon.png';
import Profile from '../Components/Profile/Profile';
import { Context } from '../Context/Context';

const ProCategory = (props) => {
  const { all_profile } = useContext(Context);

  const categoryTerms = Array.isArray(props.category)
    ? props.category.map((term) => term.toLowerCase())
    : [String(props.category).toLowerCase()];

  const filteredProfiles = all_profile.filter((item) => {
    const categoryValue = String(item.category || '').toLowerCase().trim();
    return categoryTerms.includes(categoryValue);
  });

  return (
    <div className='shop-category'>
      <img className='shopcategory-banner' src={props.banner} alt='img' />
      <div className='shopcategory-indexSort'>
        <p>
          <span>Showing {filteredProfiles.length}</span> matching professionals
        </p>
        <div className='shopcategory-sort'>
          Sort by <img src={dropdown_icon} alt='' />
        </div>
      </div>

      <div className='shopcategory-products'>
        {filteredProfiles.map((item, i) => (
          <Profile
            key={i}
            id={item.id}
            name={item.name}
            image={item.image}
            rating={item.rating}
            skills={item.skills}
            category={item.category}
            location={item.location}
            phone={item.phone}
            owner={item.owner}
          />
        ))}
      </div>

      {filteredProfiles.length === 0 && (
        <p className='shopcategory-empty'>No professionals found in this category yet.</p>
      )}

      <div className='shopcategory-loadmore'>
        Explore More
      </div>
    </div>
  );
};

export default ProCategory;
