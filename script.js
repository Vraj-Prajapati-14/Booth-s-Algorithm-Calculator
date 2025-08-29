class BoothsAlgorithm {

    constructor() {
        this.steps = [];
        this.currentStep = 0;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                // Only prevent default for internal links (starting with #)
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
                // External links (like binary-division.html) will work normally
            });
        });

        // Calculator
        document.getElementById('calculateBtn').addEventListener('click', () => {
            this.calculate();
        });

        // Step controls
        document.getElementById('prevStep').addEventListener('click', () => {
            this.previousStep();
        });

        document.getElementById('nextStep').addEventListener('click', () => {
            this.nextStep();
        });



        // Example cards
        document.querySelectorAll('.example-card button').forEach(button => {
            button.addEventListener('click', (e) => {
                const card = e.target.closest('.example-card');
                const m = parseInt(card.dataset.m);
                const q = parseInt(card.dataset.q);
                this.loadExample(m, q);
            });
        });

        // Input validation
        document.getElementById('multiplicand').addEventListener('input', this.updateBinaryDisplay.bind(this));
        document.getElementById('multiplier').addEventListener('input', this.updateBinaryDisplay.bind(this));

        // Initialize binary display
        this.updateBinaryDisplay();
    }

    updateBinaryDisplay() {
        const m = parseInt(document.getElementById('multiplicand').value) || 0;
        const q = parseInt(document.getElementById('multiplier').value) || 0;
        
        document.getElementById('mBinary').textContent = this.toBinary(m, 8);
        document.getElementById('qBinary').textContent = this.toBinary(q, 8);
        document.getElementById('expectedResult').textContent = m * q;
    }

    toBinary(num, bits = 8) {
        if (num < 0) {
            // Convert to 2's complement
            const positive = Math.abs(num);
            const binary = positive.toString(2).padStart(bits, '0');
            const inverted = binary.split('').map(bit => bit === '0' ? '1' : '0').join('');
            const result = (parseInt(inverted, 2) + 1).toString(2).padStart(bits, '0');
            return result.slice(-bits);
        }
        return num.toString(2).padStart(bits, '0');
    }

    fromBinary(binary) {
        if (binary[0] === '1') {
            // Negative number in 2's complement
            const inverted = binary.split('').map(bit => bit === '0' ? '1' : '0').join('');
            return -(parseInt(inverted, 2) + 1);
        }
        return parseInt(binary, 2);
    }

    calculate() {
        const m = parseInt(document.getElementById('multiplicand').value);
        const q = parseInt(document.getElementById('multiplier').value);
        
        if (isNaN(m) || isNaN(q)) {
            alert('Please enter valid numbers');
            return;
        }

        this.steps = [];
        this.currentStep = 0;
        
        // Calculate required bit length dynamically
        const maxValue = Math.max(Math.abs(m), Math.abs(q));
        const minBits = Math.ceil(Math.log2(maxValue + 1)) + 1; // +1 for sign bit
        const bitLength = Math.max(8, minBits); // Minimum 8 bits for educational purposes
        
        let A = '0'.repeat(bitLength);
        let Q = this.toBinary(q, bitLength);
        let Q_minus_1 = '0';
        let M = this.toBinary(m, bitLength);
        let M_negative = this.toBinary(-m, bitLength);
        
        this.steps.push({
            step: 0,
            q0: Q[Q.length - 1],
            q_minus_1: Q_minus_1,
            action: 'Initialize',
            A: A,
            Q: Q,
            Q_minus_1: Q_minus_1,
            explanation: `Initialize: A=0, Q=${q} (${Q}), Q₋₁=0. Using ${bitLength}-bit representation.`
        });

        // Perform Booth's algorithm
        for (let i = 0; i < bitLength; i++) {
            const q0 = Q[Q.length - 1];
            const q_minus_1 = Q_minus_1;
            
            let action = '';
            let explanation = '';
            let operationPerformed = false;
            
            if (q0 === '0' && q_minus_1 === '0') {
                action = 'No operation';
                explanation = `Step ${i + 1}: Q₀=0, Q₋₁=0 → String of 0s detected. Just perform arithmetic right shift.`;
            } else if (q0 === '0' && q_minus_1 === '1') {
                action = `Add M (${m})`;
                explanation = `Step ${i + 1}: Q₀=0, Q₋₁=1 → End of 1s string detected. Add multiplicand ${m} to accumulator.`;
                A = this.addBinary(A, M);
                operationPerformed = true;
            } else if (q0 === '1' && q_minus_1 === '0') {
                action = `Subtract M (${m})`;
                explanation = `Step ${i + 1}: Q₀=1, Q₋₁=0 → Start of 1s string detected. Subtract multiplicand ${m} from accumulator.`;
                A = this.addBinary(A, M_negative);
                operationPerformed = true;
            } else if (q0 === '1' && q_minus_1 === '1') {
                action = 'No operation';
                explanation = `Step ${i + 1}: Q₀=1, Q₋₁=1 → Middle of 1s string detected. Just perform arithmetic right shift.`;
            }
            
            // Arithmetic right shift
            const newQ_minus_1 = Q[Q.length - 1];
            Q = A[A.length - 1] + Q.slice(0, -1);
            A = A[0] + A.slice(0, -1);
            
            // Add operation details to explanation
            if (operationPerformed) {
                explanation += ` After ${action.toLowerCase()}, perform arithmetic right shift.`;
            } else {
                explanation += ` Perform arithmetic right shift.`;
            }
            
            this.steps.push({
                step: i + 1,
                q0: q0,
                q_minus_1: q_minus_1,
                action: action,
                A: A,
                Q: Q,
                Q_minus_1: newQ_minus_1,
                explanation: explanation
            });
            
            Q_minus_1 = newQ_minus_1;
        }

        this.displaySteps();
        this.updateStepCounter();
        this.enableStepControls();
        
        // Show final result after calculation
        this.showFinalResult();
    }

    addBinary(a, b) {
        const maxLength = Math.max(a.length, b.length);
        a = a.padStart(maxLength, a[0]); // Sign extend
        b = b.padStart(maxLength, b[0]); // Sign extend
        
        let result = '';
        let carry = 0;
        
        for (let i = maxLength - 1; i >= 0; i--) {
            const sum = parseInt(a[i]) + parseInt(b[i]) + carry;
            result = (sum % 2) + result;
            carry = Math.floor(sum / 2);
        }
        
        return result.slice(-maxLength);
    }

    displaySteps() {
        const tbody = document.getElementById('stepsTableBody');
        tbody.innerHTML = '';
        
        this.steps.forEach((step, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${step.step}</td>
                <td>${step.q0}</td>
                <td>${step.q_minus_1}</td>
                <td>${step.action}</td>
                <td><code>${step.A}</code></td>
                <td><code>${step.Q}</code></td>
                <td>${step.Q_minus_1}</td>
                <td>${step.explanation}</td>
            `;
            tbody.appendChild(row);
        });
        
        this.showCurrentStep();
    }

    showCurrentStep() {
        const rows = document.querySelectorAll('#stepsTableBody tr');
        rows.forEach((row, index) => {
            row.classList.remove('active', 'completed');
            if (index === this.currentStep) {
                row.classList.add('active');
                row.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (index < this.currentStep) {
                row.classList.add('completed');
            }
        });
    }

    nextStep() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            this.showCurrentStep();
            this.updateStepCounter();
            this.updateFinalResult();
        }
        this.updateStepControls();
    }

    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.showCurrentStep();
            this.updateStepCounter();
            this.updateFinalResult();
        }
        this.updateStepControls();
    }

    updateStepCounter() {
        document.getElementById('stepCounter').textContent = `Step ${this.currentStep} of ${this.steps.length - 1}`;
    }

    updateStepControls() {
        document.getElementById('prevStep').disabled = this.currentStep === 0;
        document.getElementById('nextStep').disabled = this.currentStep === this.steps.length - 1;
    }

    updateFinalResult() {
        if (this.steps.length > 0 && this.currentStep > 0) {
            const currentStep = this.steps[this.currentStep];
            const resultBinary = currentStep.A + currentStep.Q;
            const resultDecimal = this.fromBinary(resultBinary);
            
            // Get expected result
            const m = parseInt(document.getElementById('multiplicand').value);
            const q = parseInt(document.getElementById('multiplier').value);
            const expectedResult = m * q;
            
            document.getElementById('finalResultBinary').textContent = resultBinary;
            document.getElementById('finalResultDecimal').textContent = resultDecimal;
            

        }
    }

    enableStepControls() {
        document.getElementById('prevStep').disabled = false;
        document.getElementById('nextStep').disabled = false;
    }



    showFinalResult() {
        if (this.steps.length > 0) {
            const finalStep = this.steps[this.steps.length - 1];
            const resultBinary = finalStep.A + finalStep.Q;
            const resultDecimal = this.fromBinary(resultBinary);
            
            // Get expected result
            const m = parseInt(document.getElementById('multiplicand').value);
            const q = parseInt(document.getElementById('multiplier').value);
            const expectedResult = m * q;
            
            document.getElementById('finalResultBinary').textContent = resultBinary;
            document.getElementById('finalResultDecimal').textContent = resultDecimal;
            
            // Add detailed result information
            const resultInfo = document.getElementById('resultInfo');
            if (resultInfo) {
                resultInfo.innerHTML = `
                    <div class="result-details">
                        <p><strong>Calculation:</strong> ${m} × ${q} = ${expectedResult}</p>
                        <p><strong>Booth's Algorithm Result:</strong> ${resultDecimal}</p>
                        <p><strong>Binary Representation:</strong> ${resultBinary}</p>
                        <p><strong>Total Steps:</strong> ${this.steps.length} (${this.steps.length - 1} bit operations)</p>
                    </div>
                `;
            }
        }
    }

    loadExample(m, q) {
        document.getElementById('multiplicand').value = m;
        document.getElementById('multiplier').value = q;
        this.updateBinaryDisplay();
        this.calculate();
        
        // Scroll to calculator
        document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new BoothsAlgorithm();
    
    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.theory-card, .step, .example-card').forEach(el => {
        observer.observe(el);
    });
    
    // Add smooth scrolling for all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
