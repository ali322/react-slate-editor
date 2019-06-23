import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Editor } from 'slate-react'
import Plain from 'slate-plain-serializer'
import { MdFormatBold, MdFormatItalic, MdCode, MdFormatUnderlined, MdFormatQuote, MdFormatListNumbered, MdFormatListBulleted } from 'react-icons/md'
import './editor.less'

const DEFAULT_NODE = 'paragraph'

export default class RichTextEditor extends Component {
  static propTypes = {
    value: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func
  }
  state = {
    value: Plain.deserialize(this.props.value)
  }
  hasBlock(type) {
    const { value } = this.state
    return value.blocks.some(node => node.type === type)
  }
  onChange = ({ value }) => {
    if (value.document !== this.state.value.document) {
      const content = Plain.serialize(value)
      this.props.onChange(content)
    }
    this.setState({ value })
  }
  onMarkClick = (evt, type) => {
    evt.preventDefault()
    this.editor.toggleMark(type)
  }
  onBlockClick = (evt, type) => {
    evt.preventDefault()
    const { value } = this.editor
    const { document } = value
    if (type !== 'bulleted-list' && type !== 'numbered-list') {
      const isActive = this.hasBlock(type)
      const isList = this.hasBlock('list-item')
      if (isList) {
        this.editor.setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list').unwrapBlock('numbered-list')
      } else {
        this.editor.setBlocks(isActive ? DEFAULT_NODE : type)
      }
    } else {
      const isList = this.hasBlock('list-item')
      const isType = value.blocks.some(block => {
        return !!document.getClosest(block.key, parent => parent.type === type)
      })
      if (isList && isType) {
        this.editor.setBlocks(DEFAULT_NODE)
          .unwrapBlock('bulleted-list').unwrapBlock('numbered-list')
      } else if (isList) {
        this.editor.unwrapBlock(type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list')
          .wrapBlock(type)
      } else {
        this.editor.setBlocks('list-item').wrapBlock(type)
      }
    }
  }
  renderIcon = (type) => {
    if (type === 'bold') {
      return <MdFormatBold></MdFormatBold>
    } else if (type === 'code') {
      return <MdCode></MdCode>
    } else if (type === 'italic') {
      return <MdFormatItalic></MdFormatItalic>
    } else if (type === 'underlined') {
      return <MdFormatUnderlined></MdFormatUnderlined>
    } else if (type === 'block-quote') {
      return <MdFormatQuote></MdFormatQuote>
    } else if (type === 'numbered-list') {
      return <MdFormatListNumbered></MdFormatListNumbered>
    } else if (type === 'bulleted-list') {
      return <MdFormatListBulleted></MdFormatListBulleted>
    }
  }
  renderMarkButton = (type) => {
    const actived = this.state.value.activeMarks.some(mark => mark.type === type)
    return (
      <button disabled={actived} onClick={evt => this.onMarkClick(evt, type)}>{this.renderIcon(type)}</button>
    )
  }
  renderBlockButton = (type) => {
    let actived = this.state.value.blocks.some(node => node.type === type)
    if (['numbered-list', 'bulleted-list'].includes(type)) {
      const { value: { document, blocks } } = this.state
      if (blocks.size > 0) {
        const parent = document.getParent(blocks.first().key)
        actived = this.state.value.blocks.some(node => node.type === 'list-item') && parent && parent.type === type
      }
    }
    return (
      <button disabled={actived} onClick={evt => this.onBlockClick(evt, type)}>{this.renderIcon(type)}</button>
    )
  }
  renderMark = (props, editor, next) => {
    const { children, mark, attributes } = props
    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>
      case 'code':
        return <code {...attributes}>{children}</code>
      case 'italic':
        return <em {...attributes}>{children}</em>
      case 'underlined':
        return <u {...attributes}>{children}</u>
      default:
        return next()
    }
  }
  renderBlock = (props, editor, next) => {
    const { attributes, children, node } = props
    switch (node.type) {
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>
      case 'heading-one':
        return <h1 {...attributes}>{children}</h1>
      case 'heading-two':
        return <h2 {...attributes}>{children}</h2>
      case 'list-item':
        return <li {...attributes}>{children}</li>
      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>
      default:
        return next()
    }
  }
  render() {
    return (
      <div>
        <div className="toolbar">
          <div className="btn-group">
            {this.renderMarkButton('bold')}
            {this.renderMarkButton('italic')}
            {this.renderMarkButton('underlined')}
            {this.renderMarkButton('code')}
          </div>
          <div className="btn-group">
            {this.renderBlockButton('block-quote')}
            {this.renderBlockButton('numbered-list')}
            {this.renderBlockButton('bulleted-list')}
          </div>
        </div>
        <Editor
          spellCheck autoFocus
          ref={(ref) => this.editor = ref}
          placeholder={this.props.placeholder}
          value={this.state.value}
          onChange={this.onChange}
          renderMark={this.renderMark}
          renderBlock={this.renderBlock}
        />
      </div>
    )
  }
}
