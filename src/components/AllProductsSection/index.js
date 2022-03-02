import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const apiResponseConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

class AllProductsSection extends Component {
  state = {
    productsList: [],
    activeOptionId: sortbyOptions[0].optionId,
    apiStatus: apiResponseConstants.initial,
    activeCategoryId: '',
    activeRatingId: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      apiStatus: apiResponseConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {
      activeOptionId,
      searchInput,
      activeCategoryId,
      activeRatingId,
    } = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${activeCategoryId}&title_search=${searchInput}&rating=${activeRatingId}`
    // console.log(apiUrl)
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      const searchUpdatedData = updatedData.filter(eachData =>
        eachData.title.toLowerCase().includes(searchInput),
      )
      //   console.log(searchUpdatedData)
      this.setState({
        productsList: searchUpdatedData,
        apiStatus: apiResponseConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiResponseConstants.failure,
      })
    }
  }

  changeSearchInputFunc = valueAlter => {
    this.setState(
      {
        searchInput: valueAlter,
      },
      this.getProducts,
    )
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  renderSuccessView = () => {
    const {productsList, activeOptionId} = this.state
    const lenData = productsList.length
    // TODO: Add No Products View
    if (lenData !== 0) {
      return (
        <div className="all-products-container">
          <ProductsHeader
            activeOptionId={activeOptionId}
            sortbyOptions={sortbyOptions}
            changeSortby={this.changeSortby}
          />
          <ul className="products-list">
            {productsList.map(product => (
              <ProductCard productData={product} key={product.id} />
            ))}
          </ul>
        </div>
      )
    }
    return (
      <div className="all-products-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
          alt="no products"
        />
        <h1>No Product Found</h1>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TODO: Add failure view
  renderFailureView = () => (
    <div className="fail-box">
      <img
        className="fail-pic"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
      />
      <h1 className="fail-head">Oops! Something went wrong</h1>
      <p className="fail-info">We are trying our best to solve so be patient</p>
    </div>
  )

  activeCategoryFunc = activeCategoryId => {
    this.setState(
      {
        activeCategoryId,
      },
      this.getProducts,
    )
  }

  activeRatingFunc = activeRatingId => {
    // console.log(activeRatingId)
    this.setState(
      {
        activeRatingId,
      },
      this.getProducts,
    )
  }

  renderProductsSection = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiResponseConstants.success:
        return this.renderSuccessView()
      case apiResponseConstants.failure:
        return this.renderFailureView()
      case apiResponseConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  clearRenderedFilter = () => {
    this.setState(
      {
        searchInput: '',
        activeCategoryId: '',
        activeRatingId: '',
      },
      this.getProducts,
    )
  }

  render() {
    const {activeCategoryId, searchInput, activeRatingId} = this.state
    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          activeCategoryFunc={this.activeCategoryFunc}
          activeRatingFunc={this.activeRatingFunc}
          activeCategoryId={activeCategoryId}
          activeRatingId={activeRatingId}
          searchInput={searchInput}
          changeSearchInputFunc={this.changeSearchInputFunc}
          clearFilter={this.clearRenderedFilter}
        />

        {this.renderProductsSection()}
      </div>
    )
  }
}

export default AllProductsSection
