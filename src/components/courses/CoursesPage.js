import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {loadCourses, deleteCourse} from '../../redux/actions/courseActions';
import {loadAuthors} from '../../redux/actions/authorActions';
import PropTypes from 'prop-types';
import CourseList from './CourseList';
import Spinner from './../common/Spinner';
import {Redirect} from 'react-router-dom';
import {toast} from 'react-toastify';

const CoursesPage = ({
  courses,
  authors,
  loadCourses,
  loadAuthors,
  deleteCourse,
  loading,
}) => {
  const [redirectToAddCoursePage, setRedirectToAddCoursePage] = useState(false);

  useEffect(() => {
    if (courses.length === 0) {
      loadCourses().catch(error => {
        alert('Loading courses failed' + error);
      });
    }

    if (authors.length === 0) {
      loadAuthors().catch(error => {
        alert('Loading authors failed' + error);
      });
    }
  }, []);

  const handleDeleteCourse = async course => {
    toast.success('Course deleted');
    try {
      await deleteCourse(course);
    } catch (error) {
      toast.error('Delete failed.' + error.message, {autoClose: false});
    }
  };

  return (
    <>
      {redirectToAddCoursePage && <Redirect to="/course/" />}
      <h2>Courses</h2>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <button
            style={{marginBottom: 20}}
            className="btn btn-primary add-course"
            onClick={() => setRedirectToAddCoursePage(true)}
          >
            Add Course
          </button>

          <CourseList onDeleteClick={handleDeleteCourse} courses={courses} />
        </>
      )}
    </>
  );
};

CoursesPage.propTypes = {
  courses: PropTypes.array.isRequired,
  authors: PropTypes.array.isRequired,
  loadCourses: PropTypes.func.isRequired,
  deleteCourse: PropTypes.func.isRequired,
  loadAuthors: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
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
    loading: state.apiCallsInProgress > 0,
  };
};

const mapDispatchToProps = {
  loadCourses,
  loadAuthors,
  deleteCourse,
};

export default connect(mapStateToProps, mapDispatchToProps)(CoursesPage);
