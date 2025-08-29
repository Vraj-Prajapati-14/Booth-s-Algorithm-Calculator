# Binary Division Calculator

An interactive web application for learning and practicing Binary Division algorithms (Restoring & Non-Restoring). This tool provides step-by-step visualization of how binary division works.

## Features

- **Two Algorithms**: Support for both Restoring and Non-Restoring division methods
- **Interactive Calculator**: Enter any two numbers and see the division process
- **Step-by-Step Process**: Detailed explanation of each step with visual highlighting
- **Algorithm Comparison**: Side-by-side comparison of both methods
- **Practice Examples**: Pre-loaded examples for different scenarios
- **Educational Content**: Comprehensive theory section with algorithm explanation
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## Algorithms Implemented

### 1. Restoring Division
- **Principle**: Subtract divisor, restore if result is negative
- **Process**: 
  1. Shift A and Q left
  2. Subtract M from A
  3. If A < 0, restore by adding M back
  4. Set Q₀ based on whether restoration was needed
- **Advantages**: Simple to understand, easy to debug
- **Disadvantages**: Slower due to extra addition step

### 2. Non-Restoring Division
- **Principle**: Continue with negative remainders, add in next iteration
- **Process**:
  1. Shift A and Q left
  2. If A ≥ 0, subtract M; if A < 0, add M
  3. Set Q₀ based on operation performed
  4. Final correction if needed
- **Advantages**: Faster, less hardware required
- **Disadvantages**: More complex logic, harder to debug

## How to Use

### 1. **Learn the Theory**
- Read the comprehensive theory section
- Understand the differences between algorithms
- Review the comparison table

### 2. **Use the Calculator**
- Enter dividend and divisor values
- Select your preferred algorithm (Restoring or Non-Restoring)
- Click "Calculate Division" to see the process

### 3. **Step-by-Step Learning**
- Use Previous/Next buttons to navigate through steps
- Each step shows:
  - Current operation
  - Register values (A, Q, M)
  - Action taken
  - Detailed explanation

### 4. **Practice with Examples**
- Try the pre-loaded examples
- Compare results between algorithms
- Experiment with different values

## Algorithm Details

### Restoring Division Algorithm

```
1. Initialize A = 0, Q = dividend, M = divisor
2. For i = 0 to n-1:
   a. Shift A and Q left
   b. A = A - M
   c. If A < 0:
      - A = A + M (restore)
      - Q₀ = 0
   d. Else:
      - Q₀ = 1
3. Quotient = Q, Remainder = A
```

### Non-Restoring Division Algorithm

```
1. Initialize A = 0, Q = dividend, M = divisor
2. For i = 0 to n-1:
   a. Shift A and Q left
   b. If A ≥ 0:
      - A = A - M
      - Q₀ = 1
   c. Else:
      - A = A + M
      - Q₀ = 0
3. If A < 0: A = A + M (final correction)
4. Quotient = Q, Remainder = A
```

## Example Calculations

### Example 1: 14 ÷ 3 = 4 R 2

**Restoring Division:**
- Step 1: Shift, subtract 3, result positive → Q₀=1
- Step 2: Shift, subtract 3, result negative → restore, Q₀=0
- Step 3: Shift, subtract 3, result positive → Q₀=1
- Result: Quotient = 4, Remainder = 2

**Non-Restoring Division:**
- Step 1: Shift, subtract 3, result positive → Q₀=1
- Step 2: Shift, subtract 3, result negative → Q₀=0
- Step 3: Shift, add 3, result positive → Q₀=1
- Final correction: A = A + 3
- Result: Quotient = 4, Remainder = 2

## Technical Implementation

### Key Features:
- **Dynamic Bit Length**: Calculates optimal bit length based on input values
- **2's Complement**: Proper handling of negative numbers
- **Binary Arithmetic**: Accurate binary addition and subtraction
- **Step-by-Step Tracking**: Detailed logging of each operation
- **Result Verification**: Compares calculated vs expected results

### File Structure:
```
binary-division.html    # Main HTML page
binary-division.js      # JavaScript implementation
styles.css             # Shared CSS styles
```

## Educational Value

This calculator is designed for:
- **Computer Architecture Students**: Learn binary division algorithms
- **Digital Logic Design**: Understand hardware implementation
- **Computer Science Education**: Practice algorithm visualization
- **Self-Learning**: Interactive way to understand complex concepts

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Future Enhancements

- Support for signed division
- Floating-point division
- Hardware circuit visualization
- Performance comparison tools
- Export results functionality

## Contributing

Feel free to contribute by:
- Reporting bugs
- Suggesting new features
- Improving documentation
- Adding more examples

## License

Educational use - Free for learning and teaching purposes.
