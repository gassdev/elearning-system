import { useEffect, useState } from 'react'
import axios from 'axios'
import CourseCard from '../components/cards/CourseCard'

const Index = ({ allCourses }) => {
  const [courses, setCourses] = useState([])

  useEffect(() => {
    // const fetchCourses = async () => {
    //   const { data } = await axios.get('/api/courses')
    //   setCourses(data)
    // }
    // fetchCourses()
    setCourses(allCourses)
  }, [])

  return (
    <>
      <h1 className="jumbotron square text-center bg-primary">
        Online Education Plateform
      </h1>
      <div className="container-fluid">
        <div className="row">
          {courses.map((course) => (
            <div key={course._id} className="col-md-4">
              {/* <pre>{JSON.stringify(course, null, 4)}</pre> */}
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps() {
  const { data } = await axios.get(`${process.env.API}/courses`)
  return {
    props: {
      allCourses: data,
    },
  }
}

export default Index
