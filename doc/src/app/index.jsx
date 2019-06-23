import React from 'react'
import { hot } from 'react-hot-loader'
import { RichTextEditor } from '@/index'

const App = () => {
  return (
    <div className="doc">
      <RichTextEditor value="" placeholder="please type something" onChange={(val) => {
        console.log('val', val)
      }}></RichTextEditor>
    </div>
  )
}

export default hot(module)(App)
