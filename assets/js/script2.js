/* 
#########################################################
Usar Icons do ionic.io ao invez de svg 
Modificar layout quando clicar para editar.
ou...
seria melhor colocar duas funções, uma de deletar e outra só para etidar? isso no menu do app em vez de um unico botão.
#########################################################
*/
var trava = true;
var totalCompra = 0;
class Produtos {
  constructor() {
    this.id;
    this.arrIds = [];
    this.arrItens = [];
  }
  add() {
    if (trava) {
      const produto = this.lerDados();
      if (this.validaCampos(produto)) {
        this.addItemArrItens(produto);
        this.escrevaTabela();
        this.setLocalStorage();
        //preenchimento dos input
        document.getElementById("item").value = '';
        document.getElementById("valor").value = '';
        document.getElementById("quantidade").value = '';
      }
    } else {
      console.log("botão Adicionar TRAVADO".toUpperCase());
    }
  }
  lerDados() {
    const produto = {};
    produto.id = ""; // Serve para reconhecer o item a ser DELETADO
    produto.nome = document.getElementById("item").value;
    produto.valor = Number(document.getElementById("valor").value);
    produto.quantidade = Number(document.getElementById("quantidade").value);
    produto.total_item = produto.valor * produto.quantidade;
    return produto;
  }
  validaCampos(produto) {
    let msg = "";
    if (produto.nome == "") {
      msg += "- Informe o Nome do produto \n";
    }
    if (produto.valor == "") {
      msg += "- Informe o Valor do produto \n";
    }
    if (produto.quantidade == "") {
      msg += "- Informe a Quantidade do produto \n";
    }
    if (msg != "") {
      alert(msg);
      return false;
    }
    return true;
  }
  addItemArrItens(produto) {
    // Aqui add a array
    this.arrItens.push(produto);
    totalCompra = this.somar();
    this.addId();
    this.activeBtnDel();
  }
  addId() {
    // Adiciona IDs aos itens, sempre add um novo item substitui os IDs anteriores começando do 0.
    for (let i = 0; i < this.arrItens.length; i++) {
      this.arrItens[i].id = i;
    }
  }
  escrevaTabela(backupLista) {
    // Adicionar ao html os itens
    const corpoTabela = document.getElementById("corpo-tabela");
    corpoTabela.innerHTML = "";
    corpoTabela.classList.add('font-itens')
    const tfooter = document.getElementById("tfooter");
    tfooter.innerHTML = "";

    let linhaTotal = tfooter.insertRow();
    linhaTotal.classList.add("total");
    linhaTotal.classList.add('font-t-tabela')

    let cell_total = linhaTotal.insertCell();
    cell_total.classList.add("td-total");
    let cell_valor_total = linhaTotal.insertCell();
    cell_valor_total.classList.add('valor-total');
    let arrayLength = 0
    if (this.arrItens.length === 0) {
      arrayLength = backupLista.length
    } else {
      arrayLength  = this.arrItens.length
    }
    for (let i = 0; i < arrayLength; i++) {
      let row = corpoTabela.insertRow();
      // let row2 = corpoTabela.insertRow();
      // let rowEdit = document.createElement('div');
      // console.log(row, rowEdit)
      row.setAttribute("id", i);
      row.classList.add('linha-item');
      let cell_nome = row.insertCell(); // Criando celulas: nome, valor e total item.
      let cell_valor = row.insertCell();
      let cell_total_item = row.insertCell();
      
      // row2.innerText = 'dsd'
      // row.insertAdjacentHTML('afterend', rowEdit)

      if (this.arrItens.length === 0) {
        var nome = backupLista[i].nome
        var quantidade = backupLista[i].quantidade
        var valor = backupLista[i].valor.toFixed(2)
        var total_item = backupLista[i].total_item.toFixed(2)
      } else {
        var nome = this.arrItens[i].nome
        var quantidade = this.arrItens[i].quantidade
        var valor = this.arrItens[i].valor.toFixed(2)
        var total_item = this.arrItens[i].total_item.toFixed(2)
      }


      cell_nome.innerHTML =`<div><p class="font-itens">${nome}</p><span><span>x</span>${quantidade}</span></div>`;
      cell_nome.classList.add("cell_nome_item");
      cell_valor.innerHTML = `R$ ` + `${valor.replace('.', ',')}`;
      cell_total_item.innerHTML = `R$ ` + `${total_item.replace('.', ',')}`;

    }
    cell_total.innerText = "Total:";
    cell_valor_total.innerHTML = `R$ ${totalCompra.toFixed(2).replace('.', ',')}`;
  }
  setLocalStorage() {
    localStorage.setItem('backupLista', JSON.stringify(this.arrItens))
  }
  loadLocalStorage() {
    const backupLista = JSON.parse(localStorage.getItem('backupLista')) ?? []
    for (let pos in backupLista){
      this.arrItens.push(backupLista[pos])
    }
    totalCompra = this.somar()
    this.escrevaTabela(backupLista)
    this.activeBtnDel()
    // localStorage.clear()
  }
  activeBtnDel() {
    if (this.arrItens.length > 0) {
      document.getElementById('btn-delete').classList.remove('oculta')
    } else {
      document.getElementById('btn-delete').classList.add('oculta')
      trava = true
      // document.getElementById("btn-add").classList.toggle('btn-travado')
    }
  }
  editar() {
    const lista_itens = document.querySelectorAll("tbody tr");
    const btnEditar = document.getElementById("btn-delete");
    const btnAdd = document.getElementById("btn-add");
    // document.querySelector('.cell_del').classList.toggle('oculta')
    if (trava) {
      trava = false;
      btnAdd.classList.add('btn-travado');
      // btnEditar.classList.add("editar-on"); // ao clicar no btn de editar ativa ele
      lista_itens.forEach((i) => {
        let delete_cell = i.insertCell();
        let edit_cell = i.insertCell();
        delete_cell.classList.add("del-edit-ico");
        edit_cell.classList.add("del-edit-ico");

        let imgDelete = document.createElement("ion-icon");
        imgDelete.setAttribute('name', 'close-circle-outline')
        imgDelete.classList.add("remove-iten");
        delete_cell.appendChild(imgDelete);

        let imgEdit = document.createElement("ion-icon");
        imgEdit.setAttribute('name', 'create-outline')
        imgEdit.classList.add("remove-iten");
        edit_cell.appendChild(imgEdit);
      });
      // Abaixo adiciona um evento de click para cada img de deletar item
      const cellDeleteImg = document.querySelectorAll(".remove-iten");
      for (let i = 0; i < this.arrItens.length; i++) {
        let img = cellDeleteImg.item(i); // .item dessa NodeList retorna um item da lista pelo índice.
        if (img.getAttribute("onclick") == null) {
          img.setAttribute("onclick","produto.deleteItem(" + this.arrItens[i].id + ")",);
        }
      }
      return;
    }
    // Essa parte é apenas para remover 
    trava = true;
    btnAdd.classList.remove('btn-travado');
    let cell_delete = document.querySelectorAll(".del-edit-ico");
    cell_delete.forEach((td) => {
      td.remove(); // remover a classe cell_delete
    });
  }
  deleteItem(id) {
    const corpoTabela = document.getElementById("corpo-tabela");
    for (let i = 0; i < this.arrItens.length; i++) {
      if (this.arrItens[i].id == id) {
        this.subtrair(i);
        this.arrItens.splice(i, 1);
        corpoTabela.deleteRow(i);
      }
    }
    this.activeBtnDel();
    localStorage.setItem('backupLista', JSON.stringify(this.arrItens))
    let btnAdd = document.getElementById("btn-add")
    if (btnAdd.classList.contains('btn-travado') && this.arrItens.length === 0) {
      btnAdd.classList.remove('btn-travado')
    }
    if (this.arrItens.length === 0) {
      // document.querySelector('.cell_del').classList.toggle('oculta')
    }
  }
  limparLista() {
    const corpoTabela = document.getElementById("corpo-tabela");
    const arrItensLength = this.arrItens.length
    for (let i = 0; i < arrItensLength; i++) {
      corpoTabela.deleteRow(0);
        this.arrItens.splice(0, 1);
    }
    totalCompra = 0
    let valor_total = document.querySelector('.valor-total')
    valor_total.innerHTML = `R$ ${totalCompra.toFixed(2)}`;
    this.activeBtnDel();
    localStorage.setItem('backupLista', JSON.stringify(this.arrItens))
  }
  somar() {
    const soma = this.arrItens.reduce((acc, iten) => {
      let totalSoma = acc + iten.total_item;
      return totalSoma;
    }, 0);
    return soma;
  }
  subtrair(id) {
    totalCompra -= this.arrItens[id].total_item;
    let valor_total = document.querySelector('.valor-total')
    valor_total.innerHTML = `R$ ${totalCompra.toFixed(2)}`;
  }
}
const produto = new Produtos();

window.addEventListener('keyup', (e) => e.key === 'Enter' ? produto.add() : '')

window.addEventListener('load', ()=>{
  setTimeout(produto.loadLocalStorage(), 500)
})
const navgation = document.querySelector('.div-menu')
const toggle = document.querySelector('.toggle-menu')

toggle.onclick = () => {
  navgation.classList.toggle('active')
}