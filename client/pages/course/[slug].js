import { useState, useEffect } from 'react'
import axios from 'axios'

const SingleCourse = ({ course }) => {
  return (
    <div className="container-fluid">
      <div className="row">
        <pre>{JSON.stringify(course, null, 4)}</pre>
      </div>
    </div>
  )
}

export async function getServerSideProps({ query }) {
  const { data } = await axios.get(`${process.env.API}/course/${query.slug}`)
  return {
    props: {
      course: data,
    },
  }
}

export default SingleCourse