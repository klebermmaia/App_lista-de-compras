/* 
########################__Erros__########################


#########################################################
*/
var trava = true
var totalCompra = 0
class Produtos{
  constructor(){
    this.id
    this.arrIds = []
    this.arrItens = []
  }
  add(){
    if (trava) {
      const produto = this.lerDados()
      if(this.validaCampos(produto)){
        this.adicionar(produto)
        this.listaTabela() 
        //preenchimento dos input
        document.getElementById('item').value = ''
        document.getElementById('valor').value = 1
        document.getElementById('quantidade').value = 1
      }
    } else {
      console.log('botão Adicionar TRAVADO'.toUpperCase())
    }
  }
  lerDados(){
    const produto = {}
    produto.id = '' // Serve para reconhecer o item a ser DELETADO
    produto.nome = document.getElementById('item').value
    produto.valor = Number(document.getElementById('valor').value)
    produto.quantidade = Number(document.getElementById('quantidade').value)
    produto.total_item = produto.valor * produto.quantidade
    return produto
  }
  validaCampos(produto){
    let msg =''
    if(produto.nome == ''){
      msg += '- Informe o Nome do produto \n'
    }
    if(produto.valor == ''){
      msg += '- Informe o Valor do produto \n'
    }
    if(produto.quantidade == ''){
    msg += '- Informe a Quantidade do produto \n'
    }
    if(msg != ''){
      alert(msg)
      return false
    }
    return true
  }
  adicionar(produto){ // Aqui add a array
    this.arrItens.push(produto)
    totalCompra = this.somar()
    this.addId()
  }
  addId() { // Adiciona IDs aos itens, sempre add um novo item substitui os IDs anteriores começando do 0. 
    for (let i = 0; i < this.arrItens.length; i++){
      this.arrItens[i].id = i
    }
  }
  listaTabela() { // Adicionar ao html os itens
    const tbody = document.getElementById('tbody')
    tbody.innerHTML = ''
    const tfooter = document.getElementById('tfooter')
    tfooter.innerHTML = ''
    
    let footer = tfooter.insertRow()
    footer.classList.add('footer-linha')
    let cell_total = footer.insertCell()
    cell_total.classList.add('td-total')
    let cell_valor_total = footer.insertCell()
    cell_valor_total.setAttribute('colspan', 2)
    cell_valor_total.setAttribute('id','valor_total')
    
    for(let i = 0; i < this.arrItens.length; i++){
      let tr = tbody.insertRow()
      tr.setAttribute("id", i)
      let cell_nome = tr.insertCell()
      let cell_valor = tr.insertCell()
      let cell_total_item = tr.insertCell()
      cell_total_item.setAttribute('id', 'total_item_' + i)

      cell_nome.innerHTML =`
        <div>
          <p id="nome_` + i + `">${this.arrItens[i].nome}</p>
            <span id="quantidade_` + i + `">
              (<span>x</span>${this.arrItens[i].quantidade})
            </span>
        </div>
        `
      cell_nome.classList.add('cell_nome_item')
      cell_valor.setAttribute('id', 'valor_' + i)
      cell_valor.innerHTML = `R$ ` + `${this.arrItens[i].valor.toFixed(2)}`
      cell_total_item.innerHTML = `R$ ` + `${this.arrItens[i].total_item.toFixed(2)}`
      cell_total.innerText = 'Total'
    }
    cell_valor_total.innerHTML = `R$ ${totalCompra.toFixed(2)}`
  }
  editar() { //-------Aqui vai DELETAR um ITEM
    const lista_itens = document.querySelectorAll('tbody tr')
    const btnEditar = document.getElementById('btn-editar')
    const btnAdd = document.getElementById('btn-add')

    if(trava){
      trava = false
      btnAdd.value = 'TRAVADO'
      btnEditar.classList.add("editar-on") // ao clicar no btn de editar ativa ele
      btnEditar.value = 'Cancelar'
      lista_itens.forEach((i)=>{
        let editar_cell =  i.insertCell()
        editar_cell.classList.add('cell_edit')
        
        let imgDelete = document.createElement('img')
        imgDelete.src = 'assets/media/delete_forever.svg'
        imgDelete.classList.add('img-delete')
        editar_cell.appendChild(imgDelete)
      })
      // Abaixo adiciona um evento de click para cada img de deletar item
      const cellDeleteImg = document.querySelectorAll('.img-delete')
      for(let i = 0; i < this.arrItens.length; i++){
        let img = cellDeleteImg.item(i) // .item dessa NodeList retorna um item da lista pelo índice.
        if(img.getAttribute('onclick') == null){
          img.setAttribute("onclick", "produto.deleteItem(" + this.arrItens[i].id + ")")
        }
      }
      return
    }
    trava = true
    btnAdd.value = 'Inserir'
    btnEditar.classList.remove("editar-on")
    btnEditar.value = 'Editar'
    let cell_edit = document.querySelectorAll('.cell_edit')
    cell_edit.forEach((td)=>{
      td.remove() // remover a classe cell_edit
    })
  }
  deleteItem(id){ 
    const tbody = document.getElementById('tbody')
    for(let i = 0; i < this.arrItens.length; i++){
      if(this.arrItens[i].id == id){
        this.subtrair(i)
        this.arrItens.splice(i, 1)
        tbody.deleteRow(i)
      }
    }
  }
  somar() {
    const soma = this.arrItens.reduce((acc, iten) => {
      let totalSoma = acc + iten.total_item
      return totalSoma
    }, 0)
    return soma
  }
  subtrair(id) {
    totalCompra -= this.arrItens[id].total_item
    let valor_total = document.getElementById('valor_total')
    valor_total.innerHTML = `R$ ${totalCompra.toFixed(2)}`
  }
}
const produto = new Produtos()