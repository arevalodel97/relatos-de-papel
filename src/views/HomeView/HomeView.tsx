import React from 'react'
import BookList from '../../components/BookList/BookList'
import './HomeView.css'

interface Props {
  search?: string
}

export const HomeView: React.FC<Props> = ({ search = '' }) => {
  return (
    <div className="home-view view-full">
      <BookList filter={search} />
    </div>
  )
}

export default HomeView
