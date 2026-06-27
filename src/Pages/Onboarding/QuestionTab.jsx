export default function QuestionTab({ question, options, onAnswer }) {
  return (
    <div className="question-tab">
      <h2>{question}</h2>

      <div className="options-container">
        {options.map((option, index) => (
          <button
            key={index}
            className="option-btn"
            onClick={() => onAnswer(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}