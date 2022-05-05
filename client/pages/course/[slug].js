import axios from 'axios'
import { useEffect, useState, useContext } from 'react'
import SingleCourseJumbotron from '../../components/cards/SingleCourseJumbotron'
import SingleCourseLessons from '../../components/cards/SingleCourseLessons'
import PreviewModal from '../../components/modals/PreviewModal'
import { Context } from '../../context'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

const SingleCourse = ({ selectedCourse }) => {
  // state
  const [showModal, setShowModal] = useState(false)
  const [preview, setPreview] = useState('')
  const [course, setCourse] = useState(undefined)
  const [loading, setLoading] = useState(false)
  const [enrolled, setEnrolled] = useState({})

  const router = useRouter()

  // context
  const {
    state: { user },
  } = useContext(Context)

  useEffect(() => {
    setCourse(selectedCourse)
    if (user && course) {
      checkEnrollment()
    }
  }, [user, course, selectedCourse])

  const checkEnrollment = async () => {
    const { data } = await axios.get(`/api/check-enrollment/${course._id}`)
    console.log('CHECK ENROLLMENT ----> ', data)
    setEnrolled(data)
  }

  const handlePaidEnrollment = () => {
    console.log('handle paid enrollment')
  }

  const handleFreeEnrollment = async (e) => {
    // console.log('handle free enrollment')
    e.preventDefault()
    try {
      // check if user is logged in
      if (!user) {
        router.push('/login')
      }
      // check if already enrolled
      if (enrolled.status) {
        return router.push(`/user/course/${enrolled.course.slug}`)
      }
      setLoading(true)
      const { data } = await axios.post(`/api/free-enrollment/${course._id}`)
      toast(data.message)
      setLoading(false)
      router.push(`/user/course/${data.course.slug}`)
    } catch (err) {
      toast('Enrollment failed. Try again.')
      console.log(err)
      setLoading(false)
    }
  }

  if (course) {
    return (
      <>
        {/* <pre>{JSON.stringify(course, null, 4)}</pre> */}
        <SingleCourseJumbotron
          course={course}
          showModal={showModal}
          setShowModal={setShowModal}
          preview={preview}
          setPreview={setPreview}
          user={user}
          loading={loading}
          handlePaidEnrollment={handlePaidEnrollment}
          handleFreeEnrollment={handleFreeEnrollment}
          enrolled={enrolled}
          setEnrolled={setEnrolled}
        />
        <PreviewModal
          showModal={showModal}
          setShowModal={setShowModal}
          preview={preview}
        />

        {course.lessons && (
          <SingleCourseLessons
            lessons={course.lessons}
            setPreview={setPreview}
            showModal={showModal}
            setShowModal={setShowModal}
          />
        )}
      </>
    )
  } else {
    return null
  }
}

export async function getServerSideProps({ query }) {
  const { data } = await axios.get(`${process.env.API}/course/${query.slug}`)
  return {
    props: {
      selectedCourse: data,
    },
  }
}

export default SingleCourse
