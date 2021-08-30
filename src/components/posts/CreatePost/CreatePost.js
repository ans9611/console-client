import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import { createPost } from '../../../api/posts'
import { createPostSuccess, createPostFailure } from '../../AutoDismissAlert/messages'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import Editor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-css'
import 'prismjs/themes/prism-dark.css'

import './CreatePost.scss'
import '../PostContainer/PostContainer.scss'

class CreatePost extends Component {
  constructor (props) {
    super(props)

    this.state = {
      title: '',
      content: '',
      postId: null
    }
  }

  handleChange = (event) =>
    this.setState({
      [event.target.name]: event.target.value
    })

  onCreatePost = (event) => {
    event.preventDefault()

    const { msgAlert, history, user, updatePosts } = this.props

    createPost(this.state, user)
      .then(res => {
        this.setState({ postId: res.data.post._id })
        return res
      })
      .then(res => updatePosts({
        owner: user,
        title: this.state.title,
        content: this.state.content,
        comments: [],
        _id: res.data.post._id
      }))
      .then(() => history.push('/home'))
      .then(() => {
        msgAlert({
          heading: 'Post Created',
          message: createPostSuccess,
          variant: 'success'
        })
      })
      .catch((err) => {
        msgAlert({
          heading: 'Couldn\'t Create Post',
          message: createPostFailure + err.message,
          variant: 'danger'
        })
      })
  }

  render () {
    const { title } = this.state

    return (
      <>
        <h5 id="createPostHeader">Create Post</h5>
        <div className='postContainer'>
          <Form onSubmit={this.onCreatePost}>
            <Form.Group controlId='title'>
              <Form.Control
                required
                autoComplete="off"
                className='titleInput'
                name='title'
                value={title}
                placeholder='Post Title'
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId='content'>
              <Editor className="border codeEditor"
                placeholder="// your code here"
                value={this.state.content}
                onValueChange={content => this.setState({ content })}
                highlight={content => highlight(content, languages.js)}
                padding={10}
              />
            </Form.Group>
            <Button id='createPostButton' variant='primary' type='submit'>Create</Button>
          </Form>
        </div>
      </>
    )
  }
}

export default withRouter(CreatePost)
