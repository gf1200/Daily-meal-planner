import React, { Component } from 'react';
import Modal from '../../components/UI/Modal/Modal';
import MealToChoose from './../../components/Menu/MealToChoose/MealToChoose';
import axios from '../../axios-orders';
import ModalCloseBTN from '../../components/UI/Modal/ModalCloseBTN';
import ModalFoter from '../../components/UI/Modal/ModalFoter';
import Spiner from './../../components/UI/Spiner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import AddBTN from '../../components/UI/AddBTN/AddBTN';
import ChosenMeals from '../../components/Menu/ChosenMeals/ChosenMeals';

class MealPlannerBuilder extends Component {
  state = {
    meals: null,
    chosenMeals: [],
    totalMeals: 0,
    summaryDisabld: false,
    summaryOpened: false,
    loading: false,
    error: false
  };

  onAddMeal(meal) {
    this.setState(state => {
      const numberGen = Math.floor(Math.random() * 1000 + 1);
      const addNewMeal = {
        ...meal,
        chosenId: numberGen
      };
      const chosenMeals = [...state.chosenMeals, addNewMeal];
      return { chosenMeals };
    });
  }

  onDeleteMeal(chosenId) {
    this.setState(state => {
      const chosenMeals = state.chosenMeals.filter(
        meal => meal.chosenId !== chosenId
      );
      return { chosenMeals };
    });
  }

  onConfirmePlan() {
    this.props.history.push('/current');
  }

  componentDidMount() {
    this.setState({ loading: true });

    axios
      .get('meals-2.json')
      .then(res => {
        const meals = Object.keys(res.data).map(key => ({
          id: key,
          ...res.data[key]
        }));

        this.setState({ meals, loading: false });
      })
      .catch(error => this.setState({ error: true }));
  }

  // confirmMealPlan = () => {
  //   this.setState({ loading: true });
  //   const plan = {
  //     meals: this.state.meals,
  //     customer: {
  //       name: 'John Don',
  //       adress: {
  //         street: 'Krakowska 1',
  //         zipCode: '30-000',
  //         cuntry: 'Polska'
  //       },
  //       email: 'john_d@gmail.com'
  //     },
  //     delivery: 'fastest'
  //   };

  //   axios
  //     .post('orders.json', plan)
  //     .then(response => this.setState({ loading: false }))
  //     .catch(err => this.setState({ loading: false }));
  // };

  summaryHandler = () => {
    this.setState({ summaryOpened: true });
  };

  summaryClose = () => {
    this.setState({ summaryOpened: false });
  };

  render() {
    const mealsAlreadyChosen = [...this.state.chosenMeals].map(meal => meal.id);
    let mealToChoose = null;
    let meals = this.state.error ? <p>Meals can't be loaded!</p> : <Spiner />;

    if (this.state.meals) {
      mealToChoose = (
        <MealToChoose
          alredyChosen={mealsAlreadyChosen}
          meals={this.state.meals}
          addMeal={this.onAddMeal.bind(this)}
        />
      );
      meals = (
        <React.Fragment>
          <ChosenMeals
            meals={this.state.chosenMeals}
            deleteMeal={this.onDeleteMeal.bind(this)}
            confirmClicked={this.onConfirmePlan.bind(this)}
            confirmDisable={!this.state.chosenMeals.length ? true : false}
          />
          {/* <Menu meals={this.state.meals} totalMeals={this.state.totalMeals} /> */}
          {/* <BuildControls
            mealeAdded={this.addMealHandler}
            mealRemoved={this.removeMealHandler}
            disabld={disableInfo}
            confirmDisabld={this.state.confirmeDisabld}
            target="modal2"
          /> */}
        </React.Fragment>
      );
    }

    if (this.state.loading) {
      mealToChoose = <Spiner />;
    }

    return (
      <React.Fragment>
        <Modal
          modalType="bottom-sheet"
          modalId="modal1"
          whenClosed={this.summaryClose.bind(this)}
          isShow={true}
        >
          {mealToChoose}
          <ModalFoter>
            <ModalCloseBTN name="close" />
          </ModalFoter>
        </Modal>
        {meals}
        <AddBTN modalShow={this.summaryHandler} target="modal1" />
      </React.Fragment>
    );
  }
}

export default withErrorHandler(MealPlannerBuilder, axios);
