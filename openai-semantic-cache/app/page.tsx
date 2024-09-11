'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';

interface IFormData {
  selectedSubject: string;
}

interface IOpenAIApiResponse {
  message?: string;
  error?: string;
}

export default function Home() {
  const [formData, setFormData] = useState<IFormData>({
    selectedSubject: ''
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<IOpenAIApiResponse | null>(null)
  const options: string[] = ['cats', 'dogs', 'unicorns', 'cryptids']

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (event:FormEvent<HTMLFormElement>) => {
    const OPENAI_URL = '/api/openai';

    event.preventDefault();
    setIsLoading(true);
    setResponse(null);

    try {
      const response = await fetch(OPENAI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data: IOpenAIApiResponse = await response.json();
      setResponse(data);

    } catch (error) {
      console.error("Error submitting form:", error);
      setResponse({
        error: error instanceof Error ? error.message : 'An unknown error occurred' }
      );

    } finally {
      setIsLoading(false)
    }
  }

  return (
      <main className="p-8">
        <h1 className="text-2xl">Haiku Generator</h1> 
        <p>Powered by GPT-4.o-mini</p>
        <div className="md:flex md:space-x-4 mt-8">
          <div className="md:w-1/2 mb-4 md:mb-0">
            <form onSubmit={handleSubmit} className="max-w mx-auto">
                <label htmlFor="subjectSelector">Generate a haiku about:</label>
                <select 
                  id="subjectSelector"
                  name="selectedSubject"
                  value={formData.selectedSubject}
                  onChange={handleChange}
                  required
                > 
                  <option value="" disabled>Choose a subject</option>
                  {options.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <button 
                  type="submit"
                  className="w-full py-2 px-4 my-4 rounded bg-indigo-600 disabled:bg-gray-400"
                  disabled={isLoading || !formData.selectedSubject}
                >
                  Generate
                </button>
            </form>
          </div>
          <div className="md:w-1/2 mb-4 md:mb-0">
            <h3 className="font-bold">Haiku:</h3>
            <p>{response?.error || response?.message}</p>
          </div>
        </div>
      </main>
  );
}
