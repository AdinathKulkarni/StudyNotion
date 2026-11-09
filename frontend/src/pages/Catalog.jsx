import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { apiConnector } from "../services/apiconnector"
import { categories } from "../services/apis"
import { getCatalogaPageData } from "../services/operations/pageAndComponentData"
import CourseSlider from "../components/core/Catalog/CourseSlider"
import Footer from "../components/common/Footer"
import Error from "./Error"

const Catalog = () => {
  const { catalogName } = useParams()
  const [catalogPageData, setCatalogPageData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let active = true

    const fetchCatalogData = async () => {
      setLoading(true)
      setHasError(false)
      setCatalogPageData(null)

      try {
        const response = await apiConnector("GET", categories.CATEGORIES_API)
        const category = response?.data?.data?.find(
          (item) =>
            item.name.split(" ").join("-").toLowerCase() ===
            catalogName?.toLowerCase()
        )

        if (!category) {
          setHasError(true)
          return
        }

        const data = await getCatalogaPageData(category._id)
        if (!data?.success) {
          setHasError(true)
          return
        }

        if (active) {
          setCatalogPageData(data.data)
        }
      } catch (error) {
        console.error("Could not load catalog page.", error)
        if (active) setHasError(true)
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchCatalogData()
    return () => {
      active = false
    }
  }, [catalogName])

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }
  if (hasError || !catalogPageData) {
    return <Error />
  }

  const selectedCategory = catalogPageData.selectedCategory
  const otherCategoryCourses =
    catalogPageData.differentCategories?.flatMap(
      (category) => category.course ?? []
    ) ?? []

  return (
    <>
          {/* Hero Section */}
          <div className=" box-content bg-richblack-800 px-4">
            <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
              <p className="text-sm text-richblack-300">
                {`Home / Catalog / `}
                <span className="text-yellow-25">
                  {selectedCategory?.name}
                </span>
              </p>
              <p className="text-3xl text-richblack-5">
                {selectedCategory?.name}
              </p>
              <p className="max-w-[870px] text-richblack-200">
                {selectedCategory?.description}
              </p>
            </div>
          </div>
    
          {/* Section 1 */}
          <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div className="section_heading">Courses to get you started</div>
            <div className="my-4 flex border-b border-b-richblack-600 text-sm">
              <p className="px-4 py-2 border-b border-b-yellow-25 text-yellow-25 cursor-pointer">
                Most Populer
              </p>
              <p className="px-4 py-2 text-richblack-50 cursor-pointer">
                New
              </p>
            </div>
            <div>
              <CourseSlider
                Courses={selectedCategory?.course}
              />
            </div>
          </div>
          {/* Section 2 */}
          <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div className="section_heading">
              Top courses in other categories
            </div>
            <div className="py-8">
              <CourseSlider Courses={otherCategoryCourses} />
            </div>
          </div>
    
          <Footer />
    </>
  )
}

export default Catalog