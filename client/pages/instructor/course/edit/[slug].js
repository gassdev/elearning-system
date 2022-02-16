import { useState, useEffect } from 'react'
import axios from 'axios'
import InstructorRoute from '../../../../components/routes/InstructorRoute'
import CourseCreateForm from '../../../../components/forms/CourseCreateForm'
import Resizer from 'react-image-file-resizer'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { List, Avatar } from 'antd'

const { Item } = List

const EditCourse = () => {
  // state
  const [values, setValues] = useState({
    name: '',
    description: '',
    price: '9.99',
    uploading: false,
    paid: true,
    category: '',
    loading: false,
    lessons: [],
  })

  const [image, setImage] = useState({})
  const [preview, setPreview] = useState('')
  const [uploadButtonText, setUploadButtonText] = useState('Upload Image')

  // router
  const router = useRouter()

  const { slug } = router.query

  useEffect(() => {
    loadCourse()
  }, [slug])

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`)
    if (data) {
      setValues(data)
      if (data && data.image) {
        setImage(data.image)
      }
    }
  }

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleImage = (e) => {
    let file = e.target.files[0]
    setPreview(window.URL.createObjectURL(file))
    setUploadButtonText(file.name)
    setValues({ ...values, loading: true })

    // resize
    Resizer.imageFileResizer(file, 720, 500, 'JPEG', 100, 0, async (uri) => {
      try {
        let { data } = await axios.post('/api/course/upload-image', {
          image: uri,
        })
        console.log('IMAGE UPLOADED', data)
        // set image in the state
        setImage(data)
        setValues({ ...values, loading: false })
      } catch (err) {
        console.log(err)
        setValues({ ...values, loading: false })
        toast.error('Image upload failed. Try later.')
      }
    })
  }

  const handleImageRemove = async () => {
    try {
      // console.log('REMOVE IMAGE')
      setValues({ ...values, loading: true })
      const res = await axios.post('/api/course/remove-image', { image })
      setImage({})
      setPreview('')
      setUploadButtonText('Upload Image')
      setValues({ ...values, loading: false })
    } catch (err) {
      console.log(err)
      setValues({ ...values, loading: false })
      toast.error('Image remove failed. Try later.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // console.log(values)
    try {
      const { data } = await axios.put(`/api/course/${slug}`, {
        ...values,
        image,
      })
      toast.success('Course updated successfully!')
      //   router.push('/instructor')
    } catch (err) {
      toast.error(err.response.data)
    }
  }

  return (
    <InstructorRoute>
      <h1 className="jumbotron text-center square">Update Course</h1>

      <div className="pt-3 pb-3">
        <CourseCreateForm
          handleSubmit={handleSubmit}
          handleImage={handleImage}
          handleImageRemove={handleImageRemove}
          handleChange={handleChange}
          values={values}
          setValues={setValues}
          preview={preview}
          uploadButtonText={uploadButtonText}
          editPage={true}
        />
      </div>
      <div className="row pb-5">
        <div className="col lesson-list">
          <h4>{values && values.lessons && values.lessons.length} Lessons</h4>
          <List
            itemLayout="horizontal"
            dataSource={values && values.lessons}
            renderItem={(item, index) => (
              <Item>
                <Item.Meta
                  avatar={<Avatar>{index + 1}</Avatar>}
                  title={item.title}
                ></Item.Meta>
              </Item>
            )}
          ></List>
        </div>
      </div>
      {/* <pre>{JSON.stringify(values, null, 4)}</pre>
      <hr />
      <pre>{JSON.stringify(image, null, 4)}</pre> */}
    </InstructorRoute>
  )
}

export default EditCourse