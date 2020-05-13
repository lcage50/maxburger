import React, { Component } from "react";
import { connect } from 'react-redux';
import Aux from "../../hoc/Aux/Aux";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import axios from'../../axios-orders';

export class BurgerBuilder extends Component {
  state = {
    /*  relevant to UI state, so don't need to put in redux */
    purchasing: false,
  };

  componentDidMount () {
    this.props.onInitIngredients();
  }

  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey];
      })
      .reduce( (sum, el) => {
        return sum + el;
      }, 0);
    return sum > 0;
  }

/*
  addIngredientHandler = type => {
    let count = this.state.ingredients[type];
    count += 1;
    const updatedIngredients = { ...this.state.ingredients };
    updatedIngredients[type] = count;
    const priceAddition = INGREDIENT_PRICES[type];
    let price = this.state.totalPrice;
    price += priceAddition;
    this.setState({ totalPrice: price, ingredients: updatedIngredients });
    this.updatePurchaseState(updatedIngredients);
  };

  removeIngredientHandler = type => {
    let count = this.state.ingredients[type];
    if (count <= 0) {
      return;
    }
    count -= 1;
    const updatedIngredients = { ...this.state.ingredients };
    updatedIngredients[type] = count;
    const priceSubtraction = INGREDIENT_PRICES[type];
    let price = this.state.totalPrice;
    price -= priceSubtraction;
    this.setState({ totalPrice: price, ingredients: updatedIngredients });
    this.updatePurchaseState(updatedIngredients);
  };
  */

  purchaseHandler =  () => {
    if (this.props.isAuthenticated) {
      this.setState({purchasing: true})
    } else {
      /* tells user where to redirect later */
      this.props.onSetAuthRedirectPath('/checkout');
      this.props.history.push('/auth');
    }
  }

  purchaseCancelHandler =  () => {
    this.setState({purchasing: false})
  }

  purchaseContinueHandler =  () => {
    this.props.onInitPurchase();
    this.props.history.push('/checkout');
    /*
    const queryParams = [];
    for (let i in this.state.ingredients) {
      queryParams.push(encodeURIComponent(i) + '=' 
        + encodeURIComponent(this.state.ingredients[i]));
    }
    queryParams.push('price=' + this.state.totalPrice);
    const queryString = queryParams.join('&');
    this.props.history.push({
      pathname: '/checkout',
      search: '?' + queryString
    });
    */
  }

  render() {
    const disabledInfo = {
      ...this.props.ings
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    };
    let orderSummary = null;
    let burger = this.props.error ? 
      <p>Ingredients.can't be loaded</p> : <Spinner />;
    if (this.props.ings) {
      burger = (
        <Aux>
        <Burger ingredients={this.props.ings} />
        <BuildControls
          ingredientAdded={this.props.onIngredientAdded}
          ingredientRemoved={this.props.onIngredientRemoved}
          disabled={disabledInfo}
          purchasable={this.updatePurchaseState(this.props.ings)}
          ordered={this.purchaseHandler}
          isAuth={this.props.isAuthenticated}
          price={this.props.price}
        />
        </Aux>
      );

      orderSummary = (
        <OrderSummary 
            ingredients={this.props.ings}
            price={this.props.price}
            purchaseCancelled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler}/>
      );
    }

    /*
    if (this.state.loading) { orderSummary = <Spinner />; }
    No longer needed since we're not asynchronous when viewing the
    the modal when viewing the order summary
    */

    return (
      <Aux>
        <Modal
          show={this.state.purchasing} 
          modalClosed={this.purchaseCancelHandler} >
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
} 

const mapStateToProps = state => {
  return {
    /* these come from the reducer */
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: (iName) => dispatch(actions.addIngredient(iName)),
    onIngredientRemoved: (iName) => dispatch(actions.removeIngredient(iName)),
    onInitIngredients: () => dispatch(actions.initIngredients()),
    onInitPurchase: () => dispatch(actions.purchaseInit()),
    onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
