<template>
    <div class="container mt-4">
        <h3>Giỏ hàng</h3>
        <div v-if="cartStore.items.length === 0" class="text-muted">
            Giỏ hàng đang trống
        </div>
        <table v-else class="table table-bordered text-center">
            <thead class="table-light">
                <tr>
                    <th>Sản phẩm</th>
                    <th>Giá</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in cartStore.items" :key="item.id">
                    <td>{{ item.title }}</td>
                    <td>{{ item.price.toLocaleString() }}₫</td>
                    <input type="number" min="1" v-model.number="item.quantity" class="form-control text-center"
                        style="width: 80px; margin: auto;" @input="validateQuantity(item)" />


                    <td>{{ (item.price * item.quantity).toLocaleString() }}₫</td>
                    <td>
                        <button class="btn btn-sm btn-danger" @click="cartStore.removeItem(item.id)">
                            Xóa
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="text-end fw-bold fs-5 mt-3" style="color: red;">
            Tổng: {{ cartStore.totalPrice.toLocaleString() }}₫
        </div>
        <br>
    </div>
</template>

<script setup>
import { useCartStore } from './CartStore';
const cartStore = useCartStore();

function validateQuantity(item) {
    if (item.quantity < 1) {
        item.quantity = 1;
    }
}
</script>
