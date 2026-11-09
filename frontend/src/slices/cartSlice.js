import { createSlice } from "@reduxjs/toolkit"
import { toast } from "react-hot-toast"

const loadCart = () => {
  const savedCart = localStorage.getItem("cart")
  if (!savedCart) return []

  try {
    const parsedCart = JSON.parse(savedCart)
    if (Array.isArray(parsedCart)) {
      return parsedCart.filter((course) => course && course._id)
    }
    console.error("Saved cart data is not an array")
  } catch (error) {
    console.error("Could not read saved cart data:", error)
  }
  return []
}

const initialCart = loadCart()
const initialState = {
  cart: initialCart,
  total: initialCart.reduce((total, course) => total + (Number(course.price) || 0), 0),
  totalItems: initialCart.length,
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const course = action.payload
      const index = state.cart.findIndex((item) => item._id === course._id)

      if (index >= 0) {
        // If the course is already in the cart, do not modify the quantity
        toast.error("Course already in cart")
        return
      }
      // If the course is not in the cart, add it to the cart
      state.cart.push(course)
      // Update the total quantity and price
      state.totalItems = state.cart.length
      state.total = state.cart.reduce(
        (total, item) => total + (Number(item.price) || 0),
        0
      )
      // Update to localstorage
      localStorage.setItem("cart", JSON.stringify(state.cart))
      localStorage.setItem("total", JSON.stringify(state.total))
      localStorage.setItem("totalItems", JSON.stringify(state.totalItems))
      // show toast
      toast.success("Course added to cart")
    },
    removeFromCart: (state, action) => {
      const courseId = action.payload
      const index = state.cart.findIndex((item) => item._id === courseId)

      if (index >= 0) {
        // If the course is found in the cart, remove it
        state.cart.splice(index, 1)
        state.totalItems = state.cart.length
        state.total = state.cart.reduce(
          (total, item) => total + (Number(item.price) || 0),
          0
        )
        // Update to localstorage
        localStorage.setItem("cart", JSON.stringify(state.cart))
        localStorage.setItem("total", JSON.stringify(state.total))
        localStorage.setItem("totalItems", JSON.stringify(state.totalItems))
        // show toast
        toast.success("Course removed from cart")
      }
    },
    resetCart: (state) => {
      state.cart = []
      state.total = 0
      state.totalItems = 0
      // Update to localstorage
      localStorage.removeItem("cart")
      localStorage.removeItem("total")
      localStorage.removeItem("totalItems")
    },
  },
})

export const { addToCart, removeFromCart, resetCart } = cartSlice.actions

export default cartSlice.reducer