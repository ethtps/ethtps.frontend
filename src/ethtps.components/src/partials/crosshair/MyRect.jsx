import React from 'react'
import { Rect } from 'react-konva'

export class MyRect extends React.Component {
    changeSize = () => {
        // to() is a method of `Konva.Node` instances
        this.rect.to({
            scaleX: Math.random() + 0.8,
            scaleY: Math.random() + 0.8,
            duration: 0.2,
        })
    };
    render() {
        return (
            <Rect
                ref={(node) => {
                    this.rect = node
                }}
                width={50}
                height={50}
                fill="green"
                draggable
                onDragEnd={this.changeSize}
                onDragStart={this.changeSize}
            />
        )
    }
}