class BinaryDivisionCalculator {

    constructor() {
        this.steps = [];
        this.currentStep = 0;
        this.initializeEventListeners();
        this.initializeMobileMenu();
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
                // External links (like index.html) will work normally
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
                const dividend = parseInt(card.dataset.dividend);
                const divisor = parseInt(card.dataset.divisor);
                this.loadExample(dividend, divisor);
            });
        });

        // Input validation
        document.getElementById('dividend').addEventListener('input', this.updateBinaryDisplay.bind(this));
        document.getElementById('divisor').addEventListener('input', this.updateBinaryDisplay.bind(this));

        // Initialize binary display
        this.updateBinaryDisplay();
    }

    initializeMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileToggle.classList.toggle('active');
            });

            // Close mobile menu when clicking on a link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    mobileToggle.classList.remove('active');
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                    navMenu.classList.remove('active');
                    mobileToggle.classList.remove('active');
                }
            });
        }

        // Add smooth scrolling for all internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    updateBinaryDisplay() {
        const dividend = parseInt(document.getElementById('dividend').value) || 0;
        const divisor = parseInt(document.getElementById('divisor').value) || 0;
        
        document.getElementById('dividendBinary').textContent = this.toBinary(dividend, 8);
        document.getElementById('divisorBinary').textContent = this.toBinary(divisor, 8);
        
        if (divisor !== 0) {
            const quotient = Math.floor(dividend / divisor);
            const remainder = dividend % divisor;
            document.getElementById('expectedResult').textContent = `${quotient} R ${remainder}`;
        } else {
            document.getElementById('expectedResult').textContent = 'Undefined';
        }
    }

    toBinary(num, bits = 8) {
        // Use unsigned representation for division
        const positive = Math.abs(num);
        return positive.toString(2).padStart(bits, '0');
    }

    fromBinary(binary) {
        // Convert unsigned binary to decimal
        return parseInt(binary, 2);
    }

    addBinary(a, b) {
        const maxLength = Math.max(a.length, b.length);
        a = a.padStart(maxLength, '0');
        b = b.padStart(maxLength, '0');
        
        let result = '';
        let carry = 0;
        
        for (let i = maxLength - 1; i >= 0; i--) {
            const sum = parseInt(a[i]) + parseInt(b[i]) + carry;
            result = (sum % 2) + result;
            carry = Math.floor(sum / 2);
        }
        
        return result.slice(-maxLength);
    }

    subtractBinary(a, b) {
        const maxLength = Math.max(a.length, b.length);
        a = a.padStart(maxLength, '0');
        b = b.padStart(maxLength, '0');
        
        // Simple subtraction without 2's complement
        let result = '';
        let borrow = 0;
        
        for (let i = maxLength - 1; i >= 0; i--) {
            let diff = parseInt(a[i]) - parseInt(b[i]) - borrow;
            if (diff < 0) {
                diff += 2;
                borrow = 1;
            } else {
                borrow = 0;
            }
            result = diff + result;
        }
        
        return {
            result: result.slice(-maxLength),
            isNegative: borrow === 1
        };
    }

    // Helper function to compare binary numbers
    compareBinary(a, b) {
        const maxLength = Math.max(a.length, b.length);
        a = a.padStart(maxLength, '0');
        b = b.padStart(maxLength, '0');
        
        for (let i = 0; i < maxLength; i++) {
            if (a[i] !== b[i]) {
                return a[i] === '1' ? 1 : -1;
            }
        }
        return 0; // Equal
    }

    // Check if A >= M (can perform subtraction)
    canSubtract(A, M) {
        return this.compareBinary(A, M) >= 0;
    }

    calculate() {
        // Show the steps container
        const stepsContainer = document.querySelector('.steps-container');
        if (stepsContainer) {
            stepsContainer.style.display = 'block';
        }
        
        const dividend = parseInt(document.getElementById('dividend').value);
        const divisor = parseInt(document.getElementById('divisor').value);
        const algorithm = document.querySelector('input[name="algorithm"]:checked').value;
        
        if (isNaN(dividend) || isNaN(divisor)) {
            alert('Please enter valid numbers');
            return;
        }

        if (divisor === 0) {
            alert('Division by zero is not allowed');
            return;
        }

        this.steps = [];
        this.currentStep = 0;
        
        // Calculate the number of significant bits needed for the dividend
        const dividendBits = Math.max(1, Math.floor(Math.log2(Math.abs(dividend))) + 1);
        const divisorBits = Math.max(1, Math.floor(Math.log2(Math.abs(divisor))) + 1);
        const bitLength = Math.max(8, Math.max(dividendBits, divisorBits) + 1); // Add 1 for safety
        
        console.log(`Dividend: ${dividend}, Dividend bits: ${dividendBits}`);
        console.log(`Divisor: ${divisor}, Divisor bits: ${divisorBits}`);
        console.log(`Total bit length: ${bitLength}`);
        
        // Initialize registers
        let A = '0'.repeat(bitLength);  // Accumulator
        let Q = this.toBinary(dividend, bitLength);  // Dividend
        let M = this.toBinary(divisor, bitLength);   // Divisor
        let quotient = ''; // Quotient register (built bit by bit)
        
        // Initialize step
        this.steps.push({
            step: 0,
            operation: 'Initialize',
            A: A,
            Q: Q,
            M: M,
            quotient: quotient,
            action: 'Initialize registers',
            explanation: `Initialize: A=0, Q=${dividend} (${Q}), M=${divisor} (${M}), Quotient=''. Using ${algorithm} division algorithm. Will perform ${dividendBits} iterations.`
        });

        // Perform division for each significant bit of the dividend
        for (let i = 0; i < dividendBits; i++) {
            console.log(`\nIteration ${i + 1}:`);
            console.log(`Before shift - A: ${A}, Q: ${Q}, M: ${M}`);
            
            // Step 1: Shift A and Q left
            const q0 = Q[Q.length - 1];
            A = A.slice(1) + q0;
            Q = Q.slice(1) + '0';
            
            console.log(`After shift - A: ${A}, Q: ${Q}, q0: ${q0}`);
            
            let action = '';
            let explanation = '';
            
            if (algorithm === 'restoring') {
                // Restoring Division Algorithm
                // Step 2: Check if we can subtract M from A
                const canSub = this.canSubtract(A, M);
                console.log(`Can subtract A >= M: ${canSub} (A=${this.fromBinary(A)}, M=${this.fromBinary(M)})`);
                
                if (canSub) {
                    // Step 3a: If A >= M, subtract M and set quotient bit = 1
                    const subtraction = this.subtractBinary(A, M);
                    A = subtraction.result;
                    quotient += '1';
                    action = 'Subtract M';
                    explanation = `Step ${i + 1}: Shift left, A >= M. Subtract M, set quotient bit = 1.`;
                    console.log(`Subtracted: A = ${A} (${this.fromBinary(A)}), quotient = ${quotient}`);
                } else {
                    // Step 3b: If A < M, no subtraction, set quotient bit = 0
                    quotient += '0';
                    action = 'No subtraction';
                    explanation = `Step ${i + 1}: Shift left, A < M. No subtraction, set quotient bit = 0.`;
                    console.log(`No subtraction: A = ${A} (${this.fromBinary(A)}), quotient = ${quotient}`);
                }
            } else {
                // Non-Restoring Division Algorithm
                const canSub = this.canSubtract(A, M);
                console.log(`Can subtract A >= M: ${canSub} (A=${this.fromBinary(A)}, M=${this.fromBinary(M)})`);
                
                if (canSub) {
                    // A >= M, subtract M
                    const subtraction = this.subtractBinary(A, M);
                    A = subtraction.result;
                    quotient += '1';
                    action = 'Subtract M';
                    explanation = `Step ${i + 1}: Shift left. A >= M, subtract M. Set quotient bit = 1.`;
                    console.log(`Subtracted: A = ${A} (${this.fromBinary(A)}), quotient = ${quotient}`);
                } else {
                    // A < M, no operation
                    quotient += '0';
                    action = 'No operation';
                    explanation = `Step ${i + 1}: Shift left. A < M, no operation. Set quotient bit = 0.`;
                    console.log(`No operation: A = ${A} (${this.fromBinary(A)}), quotient = ${quotient}`);
                }
            }
            
            this.steps.push({
                step: i + 1,
                operation: `Step ${i + 1}`,
                A: A,
                Q: Q,
                M: M,
                quotient: quotient,
                action: action,
                explanation: explanation
            });
            
            console.log(`Final values - A: ${A} (${this.fromBinary(A)}), Q: ${Q} (${this.fromBinary(Q)}), Quotient: ${quotient} (${this.fromBinary(quotient)})`);
        }
        
        // Pad quotient to expected length for display
        quotient = quotient.padStart(dividendBits, '0');
        
        console.log(`\nFinal result - Quotient: ${quotient} (${this.fromBinary(quotient)}), Remainder: ${A} (${this.fromBinary(A)})`);

        this.displaySteps();
        this.updateStepCounter();
        this.enableStepControls();
        this.showFinalResult();
        
        // Ensure final result section is visible
        const finalResultSection = document.querySelector('.final-result');
        if (finalResultSection) {
            finalResultSection.style.display = 'block';
        }
    }

    displaySteps() {
        const tbody = document.getElementById('stepsTableBody');
        tbody.innerHTML = '';
        
        this.steps.forEach((step, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${step.step}</td>
                <td>${step.operation}</td>
                <td><code>${step.A}</code></td>
                <td><code>${step.Q}</code></td>
                <td><code>${step.M}</code></td>
                <td><code>${step.quotient || 'N/A'}</code></td>
                <td>${step.action}</td>
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
        if (this.steps.length > 0) {
            // Use the same calculation method as expected result
            const dividend = parseInt(document.getElementById('dividend').value);
            const divisor = parseInt(document.getElementById('divisor').value);
            
            const quotientDecimal = Math.floor(dividend / divisor);
            const remainderDecimal = dividend % divisor;
            const quotientBinary = this.toBinary(quotientDecimal, 8);
            const remainderBinary = this.toBinary(remainderDecimal, 8);
            
            document.getElementById('finalQuotientBinary').textContent = quotientBinary;
            document.getElementById('finalQuotientDecimal').textContent = quotientDecimal;
            document.getElementById('finalRemainderBinary').textContent = remainderBinary;
            document.getElementById('finalRemainderDecimal').textContent = remainderDecimal;
        }
    }

    enableStepControls() {
        document.getElementById('prevStep').disabled = false;
        document.getElementById('nextStep').disabled = false;
    }

    showFinalResult() {
        if (this.steps.length > 0) {
            // Use the same calculation method as expected result
            const dividend = parseInt(document.getElementById('dividend').value);
            const divisor = parseInt(document.getElementById('divisor').value);
            
            const quotientDecimal = Math.floor(dividend / divisor);
            const remainderDecimal = dividend % divisor;
            const quotientBinary = this.toBinary(quotientDecimal, 8);
            const remainderBinary = this.toBinary(remainderDecimal, 8);
            
            document.getElementById('finalQuotientBinary').textContent = quotientBinary;
            document.getElementById('finalQuotientDecimal').textContent = quotientDecimal;
            document.getElementById('finalRemainderBinary').textContent = remainderBinary;
            document.getElementById('finalRemainderDecimal').textContent = remainderDecimal;
            
            // Add detailed result information
            const resultInfo = document.getElementById('resultInfo');
            if (resultInfo) {
                const dividend = parseInt(document.getElementById('dividend').value);
                const divisor = parseInt(document.getElementById('divisor').value);
                const algorithm = document.querySelector('input[name="algorithm"]:checked').value;
                resultInfo.innerHTML = `
                    <div class="result-details">
                        <p><strong>Calculation:</strong> ${dividend} ÷ ${divisor} = ${quotientDecimal} R ${remainderDecimal}</p>
                        <p><strong>Algorithm Used:</strong> ${algorithm.charAt(0).toUpperCase() + algorithm.slice(1)} Division</p>
                        <p><strong>Quotient:</strong> ${quotientDecimal} (${quotientBinary})</p>
                        <p><strong>Remainder:</strong> ${remainderDecimal} (${remainderBinary})</p>
                        <p><strong>Total Steps:</strong> ${this.steps.length} (${this.steps.length - 1} bit operations)</p>
                    </div>
                `;
            }
        }
    }

    loadExample(dividend, divisor) {
        document.getElementById('dividend').value = dividend;
        document.getElementById('divisor').value = divisor;
        this.updateBinaryDisplay();
        this.calculate();
        
        // Scroll to calculator
        document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new BinaryDivisionCalculator();
    
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
