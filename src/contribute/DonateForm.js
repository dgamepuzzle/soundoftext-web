import React, { Component } from 'react';

// TODO
const donationsApi = 'http://192.168.1.45:9000/donations';

class DonateForm extends Component {
  constructor() {
    super();

    this.state = {
      amount: 5
    }

    this.handleToken = this.handleToken.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleDonateClick = this.handleDonateClick.bind(this);

    this.stripeHandler = window.StripeCheckout.configure({
      key: 'pk_live_URckThi75hi6SJSNus2TEGQp',
      name: 'Sound of Text',
      locale: 'auto',
      token: this.handleToken
    });
  }

  handleToken(token) {
    const tokenId = token.id;
    const stripeAmount = this.state.amount * 100;

    const fetchOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: tokenId, amount: stripeAmount })
    };

    fetch(donationsApi, fetchOptions)
      .then(response => {
        return response.json();
      }).then(json => {
        // TODO error handling?
        // TODO show success?
      });
  }

  handleAmountChange(amount) {
    this.setState({ amount: Number(amount) });
  }

  handleDonateClick(e) {
    e.preventDefault();

    const stripeAmount = this.state.amount * 100;

    this.stripeHandler.open({
      description: 'Donation to keep Sound of Text running',
      panelLabel: 'Donate',
      amount: stripeAmount
    });
  }

  render() {
    const amount = this.state.amount;

    return (
      <div className="donate">
        <div className="grid">
          <form className="grid__item grid__item--solo">
            <div className="amounts">
              <Amount amount="5" onClick={this.handleAmountChange} />
              <Amount amount="10" onClick={this.handleAmountChange} />
              <Amount amount="25" onClick={this.handleAmountChange} />
              <CustomAmount amount={amount} onChange={this.handleAmountChange} />
            </div>
            <button className="button" onClick={this.handleDonateClick}>Donate</button>
          </form>
        </div>
      </div>
    );
  }
}

class Amount extends Component {
  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();

    this.props.onClick(this.props.amount);
  }

  render() {
    const amount= this.props.amount;

    return (
      <button
        className="amount"
        onClick={this.handleClick}
      >${amount}</button>
    );
  }
}

class CustomAmount extends Component {
  constructor() {
    super();

    this.handleTextChange = this.handleTextChange.bind(this);
  }

  handleTextChange(e) {
    e.preventDefault();

    this.props.onChange(e.target.value);
  }

  render() {
    const amount = String(this.props.amount);

    return (
      <div className="amount amount--custom">
        <span className="amount__currency">$</span>
        <input
          value={amount} onChange={this.handleTextChange} type="number"
          step="0.01" min="0" max="1000.00" placeholder="Custom amount..."
          required
        />
      </div>
    );
  }
}

export default DonateForm;
