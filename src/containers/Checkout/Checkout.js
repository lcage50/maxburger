import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

class Checkout extends Component {
/*
  state = {
    totalPrice: 0,
    ingredients: null,
  }

  componentWillMount()  {
    const query = new URLSearchParams(this.props.location.search);
    const ingredients = {};
    let price = 0;
    for (let param of query.entries()) {
      if (param[0] === 'price') {
        price = +param[1]; }
      else {
        ingredients[param[0]] = +param[1]; } }
    this.setState({ingredients: ingredients, totalPrice: price}) }
*/

  checkoutCancelledHandler = () => {
    this.props.history.goBack();
  }

  checkoutContinuedHandler = () => {
    this.props.history.replace('/checkout/contact-data');
  }

  render () {
    /* redirect if no ingredients */
    let summary = <Redirect to="/" />;
    if (this.props.ings && !this.props.purchased) {
      summary = (
      <div>
        <CheckoutSummary 
          ingredients={this.props.ings}
          checkoutCancelled={this.checkoutCancelledHandler}
          checkoutContinued={this.checkoutContinuedHandler} />
        <Route 
          path={this.props.match.path + '/contact-data'}
          component={ContactData}/>
      </div>
      )
    }
    return (
      summary
    )
  }
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    purchased: state.order.purchased
  }
}

export default connect(mapStateToProps)(Checkout);