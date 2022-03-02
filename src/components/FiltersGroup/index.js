import {BsSearch} from 'react-icons/bs'
import './index.css'

const CategoryItem = props => {
  const {activeCategoryFunc, isCategory, categoryObj} = props
  const {categoryId, name} = categoryObj
  const color = isCategory ? 'active' : ''
  const viewCategory = () => {
    activeCategoryFunc(categoryId)
  }
  return (
    <li className="cat-item">
      <button
        className={`cat-btn ${color}`}
        onClick={viewCategory}
        type="button"
      >
        {name}
      </button>
    </li>
  )
}

const RatingItem = params => {
  const {activeRatingFunc, isRating, ratingObj} = params
  const {ratingId, imageUrl} = ratingObj
  const color = isRating ? 'active' : ''
  const viewRating = () => {
    activeRatingFunc(ratingId)
  }
  return (
    <li className="rat-item">
      <button className="rat-btn" type="button" onClick={viewRating}>
        <img className="rat-pic" src={imageUrl} alt={ratingId} />
        <p className={`rat-info ${color}`}>&up</p>
      </button>
    </li>
  )
}

const FiltersGroup = props => {
  const {
    categoryOptions,
    activeCategoryFunc,
    activeRatingFunc,
    ratingsList,
    activeCategoryId,
    activeRatingId,
    changeSearchInputFunc,
    clearFilter,
    searchInput,
  } = props
  //   console.log(activeCategoryId)
  const updateSearch = event => {
    changeSearchInputFunc(event.target.value)
  }
  const resetFilter = () => {
    clearFilter()
  }
  return (
    <div className="filters-group-container">
      <div className="search-bar">
        <input
          className="in-box"
          type="search"
          onChange={updateSearch}
          placeholder="search"
          value={searchInput}
        />
        <BsSearch className="search-icon" />
      </div>
      <h1 className="filter-head">Category</h1>
      <ul className="list">
        {categoryOptions.map(eachCategory => (
          <CategoryItem
            key={eachCategory.categoryId}
            isCategory={eachCategory.categoryId === activeCategoryId}
            categoryObj={eachCategory}
            activeCategoryFunc={activeCategoryFunc}
          />
        ))}
      </ul>
      <ul className="list">
        {ratingsList.map(eachRating => (
          <RatingItem
            key={eachRating.ratingId}
            isRating={eachRating.ratingId === activeRatingId}
            ratingObj={eachRating}
            activeRatingFunc={activeRatingFunc}
          />
        ))}
      </ul>
      <button className="clr-btn" onClick={resetFilter} type="button">
        Clear Filters
      </button>
    </div>
  )
}
export default FiltersGroup
