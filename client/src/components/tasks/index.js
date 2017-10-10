import React from "react";
import * as actions from "../../redux/actions";

import { connect } from "react-redux";

export class Tasks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskInputValue: null,
      firstLoginComplete: false
    };
  }

  componentDidUpdate() {
    if (this.state.firstLoginComplete === false) {
      this.props.dispatch(
        actions.fetchUserData({ currentUserId: this.props.currentUser })
      );
      if (this.props.currentUser) {
        this.setState({
          firstLoginComplete: true
        }); 
      }
    }
  }

  onChange(event) {
    this.setState({
      taskInputValue: event.target.value
    });
  }

  submitTask(event) {
    event.preventDefault();
    console.log("submitting task -->");
    this.props.dispatch(
      actions.postTask({
        userId: this.props.currentUser,
        taskName: this.state.taskInputValue,
        deadline: "two-three weeks",
        important: true,
        urgent: true
      })
    );
    let form = document.getElementById("form");
    form.reset();
  }

  deleteTask(event) {
    console.log("delete button event -->", event.currentTarget);
  }


  mapTasksToList() {
    if (this.props.tasks !== null) {

      const taskSort = this.props.tasks.sort((taskA, taskB) => {
        return taskA.quadrantValue - taskB.quadrantValue
      });

      return taskSort.map((taskObj, index) => {
        return <li key={index}>{taskObj.taskName}</li>;
      });
    } else {
      return <li>no task</li>;
    };
  }

  userDataFetch() {
    console.log("clicked!");
    this.props.dispatch(
      actions.fetchUserData({ currentUserId: this.props.currentUser })
    );
  }
  render() {
    return (
      <div>
        <form id="form" onSubmit={event => this.submitTask(event)}>
          <input
            type="text"
            placeholder="Add a task!"
            onChange={event => this.onChange(event)}
          />
          <button type="submit">Submit Task</button>
        </form>
        <button onClick={() => this.userDataFetch()}>Testing</button>
        <ul>{this.mapTasksToList()}</ul>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  currentUser: state.authReducer.currentUser._id,
  tasks: state.taskReducer.tasks
});
export default connect(mapStateToProps)(Tasks);
