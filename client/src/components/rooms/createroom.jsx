import { navigate } from '@reach/router'
import React from 'react'
import { socket } from '../helper/socketfile'

export default class CreateRoom extends React.Component {
    state = {
        filename: '',
        extension: ["mp4", "mkv", "mpv", "avi", "webm", "x-msvideo", "x-matroska"],
        extensionCheck: false,
        errorMsg: '',
        uNameJoinee: []

    }


    componentDidMount() {
        socket.on('newJoinee', (joineeName) => {
            console.log(joineeName.data)
            this.setState({
                uNameJoinee: [...this.state.uNameJoinee, joineeName.data]
            })

        })
    }


    handleFile = (e) => {
        e.preventDefault()
        var filelist = document.getElementById('videofile').files[0]
        console.log(filelist)
        var typeOfFile = filelist.type
        console.log(typeOfFile)
        var file = e.target.value.replace(/^.*[\\]/, '')

        this.setState({
            filename: file,

        })

        var extensionVal = typeOfFile.split('/')
        console.log(extensionVal)

        if (this.state.extension.includes(extensionVal[1])) {
            this.setState({
                extensionCheck: true,
                errorMsg: ''
            })
        }
        else {
            this.setState({
                errorMsg: "please provide valid file",
                extensionCheck: false
            })
        }

        var fileUrl = URL.createObjectURL(filelist).split()
        localStorage.setItem('video_file', fileUrl)


    }


    render() {
        const { uNameJoinee } = this.state
        return (
            <div>
                <label>Browse file</label>
                <input type="file" id="videofile" onChange={this.handleFile} />
                <p>{localStorage.getItem('roomId')}</p>
                {uNameJoinee.length > 0 &&
                    uNameJoinee.map(item => {
                        return (
                            <h3>{item}</h3>
                        )
                    })}


                <div style={{ fontSize: '16px', margin: '5px' }}>
                    {this.state.extensionCheck ?
                        <div>
                            <h6 style={{ color: 'green' }}

                            >{this.state.filename}</h6>

                            <button onClick={() => { navigate('/videopage') }}>Next</button>

                        </div>

                        : <h6 style={{ color: 'red' }}>{this.state.errorMsg}</h6>}
                </div>

                <button onClick={() => { navigate(-1) }}>Back</button>

            </div>
        )
    }
}