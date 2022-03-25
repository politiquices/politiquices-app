import { Component } from "react";
import React, { useEffect, useState} from 'react'

export const MContext = React.createContext();  //exporting context object

class MyProvider extends Component {
    state = {message: ""}
    render() {
        return (
            <MContext.Provider value={{state: this.state, setMessage: (value) => this.setState({message: value })}}>
                {this.props.children}   //this indicates that all the child tags with MyProvider as Parent can access the global store.
            </MContext.Provider>)
    }
}

class Child1 extends React.Component {
render() {
    return (
        <div>
        <MContext.Consumer>
            {(context) => (
            <button onClick={()=>{context.setMessage("New Arrival")}}>Send</button>
            )}
        </MContext.Consumer>
        </div>
    ) }
}

class Child2 extends React.Component {
    render() {
        return (
        <div>
            <MContext.Consumer>
                {(context) => (<p>{context.state.message}</p>)}
            </MContext.Consumer>
         </div>
   )}
}

class App extends React.Component {
    render() {
            return (
                <div>
                     <MyProvider>
                          <div className="App">
                            <Child1/>
                            <Child2/>
                          </div>    
                   </MyProvider>

                </div>    
            );
    }
}

export default App;