
import React, { Component } from 'react';
import { withRouter } from 'react-router' 

class Switch extends Component {
     
  
componentDidMount(){
  try{

  if(this.props.location.state.CallBorad){
    this.props.history.push({
      pathname: '/CallBorad/'+this.props.location.state.TheRoom,
    state:{
      IsPublic:  this.props.location.state.IsPublic,
      IsViewer:  this.props.location.state.IsViewer
   }
    }) 

  }else{
    this.props.history.push({
      pathname: '/',
       }) } 
  }catch(e){
    this.props.history.push({
      pathname: '/',
   
    })
  }
}
    render() {
   
        return (
            <div></div>
        )

}

}

export default withRouter(Switch);
