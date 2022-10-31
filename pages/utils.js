export const getCategory = (index) => {
  switch(index) {
    case 0:
      return "building"
    case 1:
      return "forest"
    case 2:
      return "glacier"
    case 3:
      return "mountain"
    case 4:
      return "sea"
    case 5:
      return "street"
    default:
      return "none"
  }
}