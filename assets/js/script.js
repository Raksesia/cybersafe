'use strict';

// The menu remains visible on small screens if JavaScript is unavailable.
document.body.classList.add('js-ready');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.sidebar');
menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  navigation.classList.toggle('is-open', !isOpen);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.focus();
  }
});

const questions = [
  {
    question: 'A message says you won a phone but must pay a fee to claim it. What should you do?',
    options: ['Pay quickly before the offer expires.', 'Send your ID to prove you are the winner.', 'Avoid paying and verify the giveaway independently.', 'Forward the message to all your friends.'],
    correct: 2,
    explanation: 'An unexpected prize that requires payment is a scam warning sign. Verify the offer using a trusted source before taking action.'
  },
  {
    question: 'An email threatens to close your account unless you click a link. What is the safest response?',
    options: ['Open the official app or type the known website address to check.', 'Click the link because the message looks professional.', 'Reply with your password.', 'Download the attached verification tool.'],
    correct: 0,
    explanation: 'Urgency is common in phishing. Check your account through the real service instead of following an unexpected message.'
  },
  {
    question: 'Which is the best password habit?',
    options: ['Use your birthday for easy recall.', 'Use the same password everywhere.', 'Share a password with a close friend.', 'Use a long, unique password for every account.'],
    correct: 3,
    explanation: 'Long, unique passwords are harder to guess, and uniqueness prevents one stolen password from exposing multiple accounts.'
  },
  {
    question: 'How can a password manager help you?',
    options: ['It makes every website trustworthy.', 'It generates and stores strong, unique passwords.', 'It removes the need for software updates.', 'It shares passwords publicly for backup.'],
    correct: 1,
    explanation: 'A reputable password manager helps generate and store different strong passwords so you do not have to memorize each one.'
  },
  {
    question: 'What does multifactor authentication (MFA) do?',
    options: ['It lets you reuse passwords safely everywhere.', 'It guarantees that an account can never be attacked.', 'It adds another verification factor when signing in.', 'It makes your password public.'],
    correct: 2,
    explanation: 'MFA adds a verification factor beyond a password. It improves account protection but does not eliminate every risk.'
  },
  {
    question: 'A classmate repeatedly receives hurtful messages online. What is a helpful action?',
    options: ['Save evidence, report and block the account, and seek trusted support.', 'Share the messages to entertain others.', 'Send insults back to the sender.', 'Tell the classmate to keep it secret.'],
    correct: 0,
    explanation: 'Saving evidence, using platform reporting tools, and talking with a trusted adult or teacher can help address cyberbullying.'
  },
  {
    question: 'Which situation could be a warning sign of identity theft?',
    options: ['An app has an official update available.', 'You change your own profile picture.', 'Your teacher shares a lesson.', 'You receive an alert about an account you did not open.'],
    correct: 3,
    explanation: 'An account you did not create may indicate misuse of your personal information. Contact the provider through a verified channel.'
  },
  {
    question: 'Why should you install software updates from trusted sources?',
    options: ['They make all online scams disappear.', 'They can fix security weaknesses in your device or apps.', 'They allow you to share verification codes safely.', 'They replace the need for passwords.'],
    correct: 1,
    explanation: 'Updates can fix known security weaknesses. Enable automatic updates where available and use official update channels.'
  },
  {
    question: 'An online shop has unusually cheap products and asks for urgent payment. What should you do first?',
    options: ['Pay immediately to reserve the deal.', 'Assume a padlock symbol proves the seller is honest.', 'Check independent reviews and verify the seller.', 'Send a photo of your bank card.'],
    correct: 2,
    explanation: 'Check the seller independently before paying. HTTPS protects a connection, but it does not prove that a seller is legitimate.'
  },
  {
    question: 'Someone claiming to be support asks for your one-time sign-in code. What should you do?',
    options: ['Keep the code private and contact support through the official service.', 'Share it because the person knows your name.', 'Post the code so others can help.', 'Approve every sign-in prompt you receive.'],
    correct: 0,
    explanation: 'One-time codes can give someone access to your account. Keep them private and reject sign-in requests you did not initiate.'
  }
];

const quizSection = document.querySelector('#quiz-section');
if (quizSection) {
  const form = document.querySelector('#quiz-form');
  const title = document.querySelector('#question-title');
  const options = document.querySelector('#answer-options');
  const feedback = document.querySelector('#answer-feedback');
  const progressText = document.querySelector('#question-progress');
  const answeredCount = document.querySelector('#answered-count');
  const progressBar = document.querySelector('#quiz-progress');
  const previousButton = document.querySelector('#previous-button');
  const nextButton = document.querySelector('#next-button');
  const submitButton = document.querySelector('#submit-button');
  const error = document.querySelector('#quiz-error');
  const results = document.querySelector('#quiz-results');
  let currentQuestion = 0;
  let answers = Array(questions.length).fill(null);

  function updateProgress() {
    const completed = answers.filter(answer => answer !== null).length;
    answeredCount.textContent = `${completed} of ${questions.length} answered`;
    progressBar.value = completed;
  }

  function updateFeedback() {
    const item = questions[currentQuestion];
    const selected = answers[currentQuestion];
    feedback.replaceChildren();
    if (selected === null || selected === item.correct) return;

    const panel = document.createElement('div');
    panel.className = 'answer-feedback';
    const heading = document.createElement('h3');
    heading.textContent = 'Incorrect — here’s the correct answer';
    const correctAnswer = document.createElement('p');
    correctAnswer.className = 'feedback-correct-answer';
    correctAnswer.textContent = item.options[item.correct];
    const explanation = document.createElement('p');
    explanation.textContent = item.explanation;
    panel.append(heading, correctAnswer, explanation);
    feedback.append(panel);
  }

  function renderQuestion(moveFocus = true) {
    const item = questions[currentQuestion];
    progressText.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
    title.textContent = item.question;
    options.replaceChildren();
    item.options.forEach((text, index) => {
      const label = document.createElement('label');
      label.className = 'answer';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'answer';
      input.value = index;
      input.checked = answers[currentQuestion] === index;
      input.addEventListener('change', () => {
        answers[currentQuestion] = index;
        error.hidden = true;
        updateProgress();
        updateFeedback();
      });
      const textSpan = document.createElement('span');
      textSpan.textContent = text;
      label.append(input, textSpan);
      options.append(label);
    });
    previousButton.disabled = currentQuestion === 0;
    nextButton.hidden = currentQuestion === questions.length - 1;
    submitButton.hidden = currentQuestion !== questions.length - 1;
    error.hidden = true;
    updateProgress();
    updateFeedback();
    if (moveFocus) title.focus();
  }

  previousButton.addEventListener('click', () => {
    if (currentQuestion > 0) {
      currentQuestion--;
      renderQuestion();
    }
  });
  nextButton.addEventListener('click', () => {
    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
      renderQuestion();
    }
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const firstUnanswered = answers.indexOf(null);
    if (firstUnanswered !== -1) {
      currentQuestion = firstUnanswered;
      renderQuestion();
      error.textContent = `Please answer every question before submitting. Question ${firstUnanswered + 1} still needs an answer.`;
      error.hidden = false;
      return;
    }
    showResults();
  });

  function showResults() {
    const score = answers.reduce((total, answer, index) => total + Number(answer === questions[index].correct), 0);
    quizSection.hidden = true;
    results.hidden = false;
    results.innerHTML = `<div class="score-panel"><p class="eyebrow">Quiz complete</p><h2 id="results-title" tabindex="-1">Your Results</h2><p class="score">${score} / ${questions.length}</p><p>${score === questions.length ? 'Excellent! Keep putting these safe habits into practice.' : 'Every answer is a chance to learn. Review the explanations below.'}</p><button class="button" id="retake-button" type="button">Retake Quiz</button></div><h2>Review Your Answers</h2>`;
    questions.forEach((item, index) => {
      const isCorrect = answers[index] === item.correct;
      const review = document.createElement('article');
      review.className = `review-item${isCorrect ? ' correct' : ''}`;
      const status = document.createElement('p');
      status.className = 'review-status';
      status.textContent = isCorrect ? '✓ Correct' : '✕ Incorrect';
      const heading = document.createElement('h3');
      heading.textContent = `${index + 1}. ${item.question}`;
      const selected = document.createElement('p');
      selected.textContent = `Your answer: ${item.options[answers[index]]}`;
      const correct = document.createElement('p');
      correct.textContent = `Correct answer: ${item.options[item.correct]}`;
      const explanation = document.createElement('p');
      explanation.className = 'muted';
      explanation.textContent = item.explanation;
      review.append(status, heading, selected, correct, explanation);
      results.append(review);
    });
    const source = document.createElement('p');
    source.className = 'source';
    source.innerHTML = 'Questions are based on the <a href="awareness.html">Cybersecurity Awareness lessons</a>. See <a href="about.html#main-content">About Us</a> for references.';
    results.append(source);
    document.querySelector('#retake-button').addEventListener('click', () => {
      answers = Array(questions.length).fill(null);
      currentQuestion = 0;
      results.hidden = true;
      results.replaceChildren();
      quizSection.hidden = false;
      renderQuestion();
    });
    document.querySelector('#results-title').focus();
  }

  quizSection.hidden = false;
  renderQuestion(false);
}
