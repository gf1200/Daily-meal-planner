import React from 'react';
import Meal from './Meal/Meal';
const ChosenMeals = ({ meals }) => {
  let transformedMeals = meals
    .map(meal => {
      console.log(meal);
      return (
        <li className="collection-item" key={meal.id}>
          {meal.name}
        </li>
      );
    })
    .reduce((arr, next) => {
      return arr.concat(next);
    }, []);

  if (transformedMeals.length === 0) {
    transformedMeals = (
      <li>
        <div className=" collapsible-header">
          <i className="material-icons ">info_outline</i>
          Please add some meals to menu
        </div>
      </li>
    );
  }
  return (
    <ul className="collection with-header">
      <li className="collection-header">
        <h4>Menu</h4>
      </li>
      {transformedMeals}
    </ul>
  );
};

export default ChosenMeals;
