import { screen, fireEvent, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import "@testing-library/jest-dom"
import user from '@testing-library/user-event';
import {setLocalStorage} from "../../setup-jest"
import firestore from "../app/Firestore.js"

const onNavigate = () => {return}
setLocalStorage('Employee')
Object.defineProperty(window, "location", { value: { hash: "#employee/bill/new" } })




describe("Given I am connected as an employee", () => {
  describe("When I access NewBill Page", () => {
    test("Then the newBill page should be rendered", () => {
      document.body.innerHTML = NewBillUI()
      expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy()
    })
    test("Then a form with nine fields should be rendered", () => {
      document.body.innerHTML = NewBillUI()
      const form = document.querySelector("form")
      expect(form.length).toEqual(9)
    })
  })
  describe("When I'm on NewBill Page", () => {
    describe("And I upload a image file", () => {
      test("Then the file handler should show a file", () => {
        document.body.innerHTML = NewBillUI()
        const newBill = new NewBill({ document, onNavigate, firestore: firestore, localStorage: window.localStorage })
        const handleChangeFile = jest.fn(() => newBill.handleChangeFile)
        const inputFile = screen.getByTestId("file")
        inputFile.addEventListener("change", handleChangeFile)
        fireEvent.change(inputFile, {
            target: {
                files: [new File(["sample.txt"], "sample.txt", { type: "text/txt" })],
            }
        })
        const numberOfFile = screen.getByTestId("file").files.length
        expect(numberOfFile).toEqual(1)
      })
    })
    describe("And I upload a non-image file", () => {
      test("Then the error message should be display", async () => {
        document.body.innerHTML = NewBillUI()
        const newBill = new NewBill({ document, onNavigate, firestore: firestore, localStorage: window.localStorage })
        const handleChangeFile = jest.fn(() => newBill.handleChangeFile)
        const inputFile = screen.getByTestId("file")
        inputFile.addEventListener("change", handleChangeFile)
        fireEvent.change(inputFile, {
            target: {
                files: [new File(["sample.txt"], "sample.txt", { type: "text/txt" })],
            }
        })
        expect(handleChangeFile).toBeCalled()
        expect(inputFile.files[0].name).toBe("sample.txt")
        expect(document.querySelector("#error").style.display).toBe("flex")
      })
    })
    describe("And I submit a valid bill form", () => {
      test('then a bill is created', async () => {
        document.body.innerHTML = NewBillUI()
        const newBill = new NewBill({ document, onNavigate, firestore: firestore, localStorage: window.localStorage })
        const submit = screen.getByTestId('form-new-bill')
        const validBill = {
          name: "validBill",
          date: "2021-08-07",
          type: "Transports",
          amount: 69,
          pct: 20,
          vat: "30",
          fileName: "test.jpg",
          fileUrl: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fcpmr-islands.org%2Ffr%2Ftest-2%2F&psig=AOvVaw2rc0xMNUSvTgUJ1cd3dHy_&ust=1631350098263000&source=images&cd=vfe&ved=2ahUKEwiAupTqgvTyAhWv0eAKHepTCmQQjRx6BAgAEAk"
        }
        const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))
        newBill.createBill = (newBill) => newBill
        document.querySelector(`input[data-testid="expense-name"]`).value = validBill.name
        document.querySelector(`input[data-testid="datepicker"]`).value = validBill.date
        document.querySelector(`select[data-testid="expense-type"]`).value = validBill.type
        document.querySelector(`input[data-testid="amount"]`).value = validBill.amount
        document.querySelector(`input[data-testid="vat"]`).value = validBill.vat
        document.querySelector(`input[data-testid="pct"]`).value = validBill.pct
        document.querySelector(`textarea[data-testid="commentary"]`).value = validBill.commentary
        newBill.fileUrl = validBill.fileUrl
        newBill.fileName = validBill.fileName 
        submit.addEventListener('click', handleSubmit)
        fireEvent.click(submit)
        expect(handleSubmit).toHaveBeenCalled()

        // Rajout de l'arrivée sur la page suivante
        // Faire le mock du local storage
        // Test si erreur d'affichage des bills
      })
    })
  })
    
})









// describe("Given I am connected as an employee", () => {
//   describe("When I am on NewBill Page", () => {
//     test("Then verify we have the title of page", () => {
//       const html = NewBillUI()
//       document.body.innerHTML = html
//       //to-do write assertion
//       const newBillPage = screen.getByText("Envoyer une note de frais")
//       console.log(newBillPage)
//       expect(newBillPage).toHaveClass("content-title")
//     })
//     test("Then the newBill page should be rendered", () => {
//       document.body.innerHTML = NewBillUI()
//       expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy()
//     })
//     // test("Then a form with nine fields should be rendered", () => {
//     //   document.body.innerHTML = NewBillUI()
//     //   const form = document.querySelector("form")
//     //   expect(form.length).toEqual(9)
//     // })
  
//     // test("it should throw an error message if the charged file isn't at the good format, jpg jpeg or png", () => {

//     // })


//     test("Then verify validate the form when something is incorrect", async () => {

//       const html = NewBillUI()
//       document.body.innerHTML = html
//       const submitButton = screen.getByText("Envoyer")
//       fireEvent.submit(submitButton)

//       await waitFor(() => {
//         const newBillPage = screen.getByText("Envoyer une note de frais")
//         expect(newBillPage).toHaveClass("content-title")
//       }) 
//     })

//     test("Then validate form and redirect on home employee page", async () => {
//       const html = NewBillUI()
//       document.body.innerHTML = html

//       let dateElement = screen.getByTestId("datepicker")
//       let amount = screen.getByTestId("amount")
//       let percents = screen.getByTestId("pct")

//       dateElement.value = "31/12/2021"
//       amount.value = "59"
//       percents.value = "20"

//       const str = JSON.stringify([{ name: 'teresa teng' }]);
//       const blob = new Blob([str]);
//       const file = new File([blob], 'values.json', {
//         type: 'application/JSON',
//         });
//       File.prototype.text = jest.fn().mockResolvedValueOnce(str);
//       const input = screen.getByTestId('file');
//       user.upload(input, file);
//       const submitButton = screen.getByText("Envoyer")
//       fireEvent.submit(submitButton)

//       await waitFor(() => {
//         const newBillPage = screen.getByText("Envoyer une note de frais")
//         expect(newBillPage).toHaveClass("content-title")
//       }) 

//     })  

//   })
  
// })

