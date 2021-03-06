/* eslint-disable no-undef */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import CategoryList from '../components/CategoryList'
import PostList from '../components/PostList'
import NewPostModal from '../components/NewPostModal'

import { fetchAllPosts } from '../actions/postListActions'
import { newPost, editingPost, onCreatePost, onCancelCreatePost } from '../actions/postActions'

class App extends Component {
  static propTypes = {
    categories: PropTypes.array.isRequired,
    postList: PropTypes.array.isRequired,
    fetchAllPosts: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { fetchAllPosts } = this.props
    fetchAllPosts()
  }

  handleCreatePost(post) {
    const { history, closeEditModal, createPost } = this.props
    createPost(post).then(({ payload }) => {
      // history.push()
      closeEditModal()
      history.push(`/${payload.post.category}/${payload.post.id}`)
    })
  }

  render () {
    const { history, categories, postList, newPostModalOpen,
      onCreatePost, currentPost, closeEditModal, onEditingPost } = this.props
    return (
      <div>
        <h1>Readable</h1>
        <div>
          <button onClick={() => onCreatePost() }>new post</button>
        </div>
        <CategoryList categories={categories} />
        <PostList
          history={history}
          list={postList} />
        <NewPostModal
          modalType={"create"}
          isOpen={newPostModalOpen}
          categories={categories}
          currentPost={currentPost}
          closeModal={closeEditModal}
          handleEditing={onEditingPost}
          submitPost={this.handleCreatePost.bind(this)} />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    postList: state.posts.postList,
    categories: state.posts.categories,
    newPostModalOpen: state.post.newPostModalOpen,
    currentPost: state.post.currentPost,
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchAllPosts: () => dispatch(fetchAllPosts()),
  onCreatePost: () => dispatch(onCreatePost()),
  closeEditModal: () => dispatch(onCancelCreatePost()),
  onEditingPost: (post) => dispatch(editingPost(post)),
  createPost: (post) => dispatch(newPost(post)),
})

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(App)
)
