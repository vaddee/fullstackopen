import React from 'react';

const Header = ({ course }) => {
    return (
        <div>
            <h1>{course.name}</h1>
        </div>
    );
}

const Part = ({ part }) => {
    return (
        <div>
            <p>{part.name} {part.exercises}</p>
        </div>
    );
}

const Content = ({ parts }) => {
    return (
        <div>
            {parts.map(part => 
                <Part key={part.id} part={part} />
            )}
        </div>
    );
}

const Total = ({ parts }) => {
    const totalExercises = parts.reduce((sum, part) => sum + part.exercises, 0);
    return (
        <div>
            <p>Number of exercises {totalExercises}</p>
        </div>
    );
}

const Course = ({ course }) => {
    return (
        <div>
            <Header course={course} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </div>
    );
}

export default Course;
