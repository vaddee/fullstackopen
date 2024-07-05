import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personsService from './services/personService'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState({ message: null, type: null })

  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        console.error('error fetching data', error)
        showNotification('Error fetching data', 'error')
      })
  }, [])

  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: null })
    }, 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }

    const existingPerson = persons.find(person => person.name.toLowerCase() === newName.toLowerCase())

    if (existingPerson) {
      if (window.confirm(`${newName} is already in the phonebook, replace the old number with a new one?`)) {
        personsService
          .update(existingPerson.id, personObject)
          .then(updatedPerson => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : updatedPerson))
            setNewName('')
            setNewNumber('')
            showNotification(`Updated ${newName}`, 'success')
          })
          .catch(error => {
            console.error('error updating person', error)
            if (error.response && error.response.status === 404) {
              showNotification(`Information of ${newName} has already been removed from server`, 'error')
              setPersons(persons.filter(p => p.id !== existingPerson.id))
            } else {
              showNotification('Error updating person', 'error')
            }
          })
      }
    } else {
      personsService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          showNotification(`Added ${newName}`, 'success')
        })
        .catch(error => {
          console.error('error adding person', error)
          showNotification('Error adding person', 'error')
        })
    }
  }

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personsService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          showNotification(`Deleted ${person.name}`, 'success')
        })
        .catch(error => {
          console.error('error deleting person', error)
          showNotification('Error deleting person', 'error')
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const personsToShow = filter === ''
    ? persons
    : persons.filter(person =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
      <Filter value={filter} onChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App
