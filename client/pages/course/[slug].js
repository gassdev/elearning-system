import axios from 'axios'
import { useEffect, useState } from 'react'
import SingleCourseJumbotron from '../../components/cards/SingleCourseJumbotron'

const SingleCourse = ({ selectedCourse }) => {
  // state
  const [showModal, setShowModal] = useState(false)
  const [preview, setPreview] = useState('')
  const [course, setCourse] = useState(undefined)

  useEffect(() => {
    setCourse(selectedCourse)
  }, [])

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
        />

        {showModal ? course.lessons[0].video.Location : "don't show"}
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
