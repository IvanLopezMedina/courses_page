import React from 'react';
import {connect} from 'react-redux';
import * as courseActions from '../../redux/actions/courseActions';
import * as authorActions from '../../redux/actions/authorActions';
import PropTypes from 'prop-types';
import CourseList from './CourseList';

class CoursesPage extends React.Component {
  componentDidMount() {
    const {courses, authors} = this.props;
    if (courses.length === 0) {
      this.props.loadCourses().catch(error => {
        alert('Loading courses failed' + error);
      });
    }

    if (authors.length === 0) {
      this.props.loadAuthors().catch(error => {
        alert('Loading authors failed' + error);
      });
    }
  }

  render() {
    return (
      <>
        <h2>Courses</h2>
        <CourseList courses={this.props.courses} />
      </>
    );
  }
}

CoursesPage.propTypes = {
  courses: PropTypes.array.isRequired,
  authors: PropTypes.array.isRequired,
  createCourse: PropTypes.func.isRequired,
  loadCourses: PropTypes.func.isRequired,
  loadAuthors: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    courses:
      state.authors.length === 0
        ? []
        : state.courses.map(course => {
            return {
              ...course,
              authorName: state.authors.find(a => a.id === course.authorId)
                .name,
            };
          }),
    authors: state.authors,
  };
};

const mapDispatchToProps = dispatch => ({
  createCourse: course => dispatch(courseActions.createCourse(course)),
  loadCourses: courses => dispatch(courseActions.loadCourses(courses)),
  loadAuthors: authors => dispatch(authorActions.loadAuthors(authors)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CoursesPage);
