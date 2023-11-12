import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa'

const Rating = ({ value, color }) => {
  return (
    <div>
      {value >= 1 ? (
        <FaStar color={color} />
      ) : value >= 0.5 ? (
        <FaStarHalfAlt color={color} />
      ) : (
        <FaRegStar color={color} />
      )}
      {value >= 2 ? (
        <FaStar color={color} />
      ) : value >= 1.5 ? (
        <FaStarHalfAlt color={color} />
      ) : (
        <FaRegStar color={color} />
      )}
      {value >= 3 ? (
        <FaStar color={color} />
      ) : value >= 2.5 ? (
        <FaStarHalfAlt color={color} />
      ) : (
        <FaRegStar color={color} />
      )}
      {value >= 4 ? (
        <FaStar color={color} />
      ) : value >= 3.5 ? (
        <FaStarHalfAlt color={color} />
      ) : (
        <FaRegStar color={color} />
      )}
      {value >= 5 ? (
        <FaStar color={color} />
      ) : value >= 4.5 ? (
        <FaStarHalfAlt color={color} />
      ) : (
        <FaRegStar color={color} />
      )}
    </div>
  )
}

Rating.defaultProps = {
  color: '#ffc51c',
}

export default Rating
